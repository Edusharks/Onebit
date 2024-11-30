/**
 * makecode I2C OLED 128x64 Package.
 * From microbit/micropython Chinese community.
 * http://www.micropython.org.cn
 */

//% weight=20 color=#0855AA icon="O" block="OLED12864_I2C"
namespace OLED12864_I2C {
    // Enum for Distance Units
    export enum Unit {
        //% block="cm"
        Centimeters,
        //% block="inches"
        Inches
    }

    // Constants
    const MAX_ULTRASONIC_TRAVEL_TIME = 4000; // Maximum travel time in microseconds
    const ULTRASONIC_MEASUREMENTS = 5; // Number of measurements to take

    // State object to store ultrasonic sensor data
    let ultrasonicState: {
        trig: DigitalPin | undefined;
        echo: DigitalPin | undefined;
        roundTrips: UltrasonicRoundTrip[];
        medianRoundTrip: number;
        travelTimeObservers: number[];
    } | undefined = undefined;

    // Define UltrasonicRoundTrip type
    interface UltrasonicRoundTrip {
        ts: number; // timestamp of the measurement
        rtt: number; // round trip time in microseconds
    }

    // Function to initialize the ultrasonic sensor
    //% subcategory="Ultrasonic"
    //% group="Ultrasonic Sensor"
    //% blockId="ultrasonic_ultrasonic_initialize"
    //% block="Initialize Ultrasonic on TRIG %trigPin|ECHO %echoPin"
    //% weight=180 blockGap=20
    export function initializeUltrasonicPins(trigPin: DigitalPin, echoPin: DigitalPin): void {
        // Set up the pins for trig and echo
        pins.setPull(trigPin, PinPullMode.PullNone);
        ultrasonicState = {
            trig: trigPin,
            echo: echoPin,  // Store echo pin
            roundTrips: [{ ts: 0, rtt: MAX_ULTRASONIC_TRAVEL_TIME }],
            medianRoundTrip: MAX_ULTRASONIC_TRAVEL_TIME,
            travelTimeObservers: [],
        };

        // Make sure the echo pin is set up
        pins.setPull(echoPin, PinPullMode.PullNone);

        // Set up the trig pin as an output
        pins.digitalWritePin(trigPin, 0);
    }

    // Function to get the ultrasonic distance
    //% subcategory="Ultrasonic"
    //% group="Ultrasonic Sensor"
    //% blockId="ultrasonic_ultrasonic_distance"
    //% block="ultrasonic distance in %unit"
    //% weight=100 blockGap=20
    export function getUltrasonicDistance(unit: Unit): number {
        // Check if ultrasonicState is initialized
        if (!ultrasonicState || !ultrasonicState.trig || !ultrasonicState.echo) {
            return -1; // Return -1 if the device is not initialized
        }

        // Send pulse to trigger ultrasonic sensor
        pins.setPull(ultrasonicState.trig, PinPullMode.PullNone);
        pins.digitalWritePin(ultrasonicState.trig, 0);
        control.waitMicros(2);
        pins.digitalWritePin(ultrasonicState.trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(ultrasonicState.trig, 0);

        // Read pulse duration from echo pin
        const d = pins.pulseIn(ultrasonicState.echo, PulseValue.High, 400 * 58);

        // Handle case where no echo is received
        if (d === 0) {
            return -1; // Return -1 for no response
        }

        // Convert pulse duration to distance
        let distance = 0;
        if (unit === Unit.Centimeters) {
            distance = Math.idiv(d, 58); // Convert to cm
        } else if (unit === Unit.Inches) {
            distance = Math.idiv(d, 148); // Convert to inches
        }

        return distance;
    }


    // Function to check if ultrasonic distance is less than a certain value
    //% subcategory="Ultrasonic"
    //% group="Ultrasonic Sensor"
    //% blockId="ultrasonic_less_than"
    //% block="ultrasonic distance is less than | %distance | %unit"
    //% weight=80 blockGap=20
    export function isUltrasonicDistanceLessThan(
        distance: number,
        unit: Unit
    ): boolean {
        if (!ultrasonicState) {
            return false; // Return false if the sensor is not initialized
        }
        basic.pause(0); // Yield to allow background processing when called in a tight loop
        const measuredDistance = Math.idiv(ultrasonicState.medianRoundTrip, unit);
        return measuredDistance < distance;
    }

    // Constants for event detection
    const MICROBIT_ULTRASONIC_OBJECT_DETECTED_ID = 12345;

    // Function to trigger a pulse for ultrasonic sensor
    function triggerPulse() {
        // Reset the trigger pin
        pins.setPull(ultrasonicState.trig, PinPullMode.PullNone);
        pins.digitalWritePin(ultrasonicState.trig, 0);
        control.waitMicros(2);

        // Trigger pulse
        pins.digitalWritePin(ultrasonicState.trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(ultrasonicState.trig, 0);
    }

    // Function to calculate the median of the round-trip times
    function getMedianRRT(roundTrips: UltrasonicRoundTrip[]): number {
        const roundTripTimes = roundTrips.map((urt) => urt.rtt);
        return median(roundTripTimes);
    }

    // Returns the median value from a sorted list
    function median(values: number[]): number {
        values.sort((a, b) => a - b);
        return values[(values.length - 1) >> 1];
    }

    // Measure distance in the background and trigger events based on thresholds
    function measureInBackground() {
        const trips = ultrasonicState.roundTrips;
        const TIME_BETWEEN_PULSE_MS = 145;

        while (true) {
            const now = input.runningTime();

            // Check if it's time for the next measurement
            if (trips[trips.length - 1].ts < now - TIME_BETWEEN_PULSE_MS - 10) {
                ultrasonicState.roundTrips.push({
                    ts: now,
                    rtt: MAX_ULTRASONIC_TRAVEL_TIME,
                });
            }

            // Maintain the number of stored measurements
            while (trips.length > ULTRASONIC_MEASUREMENTS) {
                trips.shift();
            }

            // Update the median round-trip time
            ultrasonicState.medianRoundTrip = getMedianRRT(ultrasonicState.roundTrips);

            // Check travel time thresholds and raise events accordingly
            for (let i = 0; i < ultrasonicState.travelTimeObservers.length; i++) {
                const threshold = ultrasonicState.travelTimeObservers[i];
                if (threshold > 0 && ultrasonicState.medianRoundTrip <= threshold) {
                    control.raiseEvent(
                        MICROBIT_ULTRASONIC_OBJECT_DETECTED_ID,
                        threshold
                    );
                    ultrasonicState.travelTimeObservers[i] = -threshold; // Mark event as raised
                } else if (
                    threshold < 0 &&
                    ultrasonicState.medianRoundTrip > -threshold
                ) {
                    // Reactivate observer if object is outside detection threshold
                    ultrasonicState.travelTimeObservers[i] = -threshold;
                }
            }

            // Send a pulse for the next measurement cycle
            triggerPulse();
            basic.pause(TIME_BETWEEN_PULSE_MS);
        }
    }


    // Function to trigger when an object is detected within a certain distance
    //% subcategory="Ultrasonic"
    //% group="Ultrasonic Sensor"
    //% blockId="ultrasonic_on_object_detected_within"
    //% block="On object detected within | %distance | %unit"
    //% weight=60 blockGap=20
    export function onObjectDetectedWithin(
        distance: number,
        unit: Unit,
        handler: () => void
    ) {
        if (distance <= 0) {
            return; // No action if distance is invalid
        }

        // Ensure ultrasonicState is initialized
        if (!ultrasonicState) {
            ultrasonicState = {
                trig: undefined,
                echo: undefined,
                roundTrips: [{ ts: 0, rtt: MAX_ULTRASONIC_TRAVEL_TIME }],
                medianRoundTrip: MAX_ULTRASONIC_TRAVEL_TIME,
                travelTimeObservers: [],
            };
        }

        // Convert the distance to travel time threshold
        const travelTimeThreshold = Math.imul(distance, unit === Unit.Centimeters ? 58 : 148);

        // Push to the travel time observers list
        ultrasonicState.travelTimeObservers.push(travelTimeThreshold);

        // Set an event listener to trigger when an object is detected within range
        control.onEvent(
            MICROBIT_ULTRASONIC_OBJECT_DETECTED_ID,
            travelTimeThreshold,
            () => {
                handler(); // Run the provided handler code when the object is detected within range
            }
        );
    }


    // Function to measure distance in the background and trigger events based on thresholds
    //% subcategory="Ultrasonic"
    //% group="Ultrasonic Sensor"
    //% blockId="ultrasonic_on_distance_change"
    //% block="On distance | %distance | %unit changes"
    //%weight=40 blockGap=20
    export function onDistanceChangeWithin(
        distance: number,
        unit: Unit,
        handler: () => void
    ) {
        if (distance <= 0) {
            return; // No action if the distance is invalid
        }

        // Ensure ultrasonicState is initialized
        if (!ultrasonicState) {
            ultrasonicState = {
                trig: undefined,
                echo: undefined,
                roundTrips: [{ ts: 0, rtt: MAX_ULTRASONIC_TRAVEL_TIME }],
                medianRoundTrip: MAX_ULTRASONIC_TRAVEL_TIME,
                travelTimeObservers: [],
            };
        }

        // Convert the distance to travel time threshold
        const travelTimeThreshold = Math.imul(distance, unit === Unit.Centimeters ? 58 : 148);

        // Push to the travel time observers list
        ultrasonicState.travelTimeObservers.push(travelTimeThreshold);

        // Set an event listener to trigger when the distance changes
        control.onEvent(
            MICROBIT_ULTRASONIC_OBJECT_DETECTED_ID,
            travelTimeThreshold,
            () => {
                handler(); // Run the provided handler code when the distance is within range
            }
        );
    }

}