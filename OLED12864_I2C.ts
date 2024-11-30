/**
 * Custom blocks for One:Bit
 */
//%  weight=100 color=#E3D114 icon="\uf1ba" block="OLED12864_I2C"

namespace OLED12864_I2C {


    // Define custom enums for digital pins
    export enum DigitalPinPrime {
        //% block="P0"
        P0 = DigitalPin.P0,
        //% block="P1"
        P1 = DigitalPin.P1,
        //% block="P2"
        P2 = DigitalPin.P2,
        //% block="P3"
        P3 = DigitalPin.P3,
        //% block="P4"
        P4 = DigitalPin.P4,
        //% block="P9"
        P9 = DigitalPin.P9,
        //% block="P10"
        P10 = DigitalPin.P10,
        //% block="P13"
        P13 = DigitalPin.P13,
        //% block="P14"
        P14 = DigitalPin.P14,
        //% block="P15"
        P15 = DigitalPin.P15,
        //% block="P19"
        P19 = DigitalPin.P19,
        //% block="P20"
        P20 = DigitalPin.P20
    }

    // Define custom enums for analog pins
    export enum AnalogPinPrime {
        //% block="P0"
        P0 = AnalogPin.P0,
        //% block="P1"
        P1 = AnalogPin.P1,
        //% block="P2"
        P2 = AnalogPin.P2,
        //% block="P3"
        P3 = AnalogPin.P3,
        //% block="P4"
        P4 = AnalogPin.P4,
        //% block="P10"
        P10 = AnalogPin.P10
    }


    ////////////////////
    //  PRIME BLOCKS  //
    ////////////////////

    // Function for reading a digital value from a pin
    //% subcategory="Prime"
    //% group="Digital Pins"
    //% weight=150 blockGap=8
    //% blockId="digital_read"
    //% block="Read digital pin %pin"
    export function digitalRead(pin: DigitalPinPrime): number {
        return pins.digitalReadPin(pin);
    }

    // Function for writing a digital value to a pin
    //% subcategory="Prime"
    //% group="Digital Pins"
    //% blockId="digital_write"
    //% weight=140 blockGap= 50
    //% block="Write digital pin %pin |to %value"
    export function digitalWrite(pin: DigitalPinPrime, value: number): void {
        pins.digitalWritePin(pin, value);
    }

    // Function for reading an analog value from a pin
    //% subcategory="Prime"
    //% group="Analog Pins"
    //% blockId="analog_read"
    //% weight=130 blockGap=8
    //% block="Read analog pin %pin"
    export function analogRead(pin: AnalogPinPrime): number {
        return pins.analogReadPin(pin);
    }

    // Function for writing an analog value to a pin
    //% subcategory="Prime"
    //% group="Analog Pins"
    //% weight=120 blockGap=8
    //% blockId="analog_write"
    //% block="Write analog pin %pin |to %value "
    //% value.min=0 value.max=1023
    export function analogWrite(pin: AnalogPinPrime, value: number): void {
        pins.analogWritePin(pin, value);
    }



    let primeBuffer: Buffer = null; // LED data buffer
    let primeNumLeds: number = 12;  // Number of LEDs
    let primeBrightness: number = 255; // Default brightness


    /**
     * Initialize the Prime
     * @param numLeds number of LEDs in the strip
     */
    //% subcategory="Prime"
    //% blockId="one_bit_prime_initialize"
    //% group="Neo_Color"
    //% block="initialize Prime with %numLeds|LEDs"
    //% weight=150 blockGap=8
    //% blockNamespace="One_Bit"
    export function initializePrime(numLeds: number): void {
        primeNumLeds = numLeds;
        primeBuffer = control.createBuffer(numLeds * 3);
        clearPrime(); // Ensure all LEDs start off
    }

    /**
     * Show data on the LEDs
     */
    function showPrimeBuffer(): void {
        if (primeBuffer) {
            light.sendWS2812Buffer(primeBuffer, DigitalPin.P16);
        }
    }

    /**
     * Show rainbow colors on the strip
     */
    //% subcategory="Prime"
    //% group="Neo_Color"
    //% blockId="one_bit_prime_show_rainbow"
    //% block="show Prime"
    //% weight=140 blockGap=8
    export function showPrime(): void {
        if (primeBuffer) {
            for (let i = 0; i < primeNumLeds; i++) {
                let angle = (i / primeNumLeds) * 2 * Math.PI;
                let red = Math.max(0, Math.sin(angle + (1 / 3) * Math.PI) * 127 + 128);
                let green = Math.max(0, Math.sin(angle + (2 / 3) * Math.PI) * 127 + 128);
                let blue = Math.max(0, Math.sin(angle + (4 / 3) * Math.PI) * 127 + 128);
                setPrimeLedColorRaw(i, Math.floor(red), Math.floor(green), Math.floor(blue));
            }
            showPrimeBuffer();
        }
    }

    /**
     * Clear all LEDs on the strip
     */
    //% subcategory="Prime"
    //% group="Neo_Color"
    //% blockId="one_bit_prime_clear"
    //% block="clear Prime"
    //% weight=130 blockGap=8
    export function clearPrime(): void {
        if (primeBuffer) {
            primeBuffer.fill(0);
            showPrimeBuffer();
        }
    }


    /**
     * Set color of all LEDs on the strip
     * @param color the color to set
     */
    //% subcategory="Prime"
    //% value.defl='#ff0000'
    //% group="Neo_Color"
    //% blockId="one_bit_prime_set_color"
    //% block="set Prime color to %color"
    //% weight=120 blockGap=8
    //% color.shadow="brightColorNumberPicker"
    export function setPrimeColor(color: number): void {
        let red = (color >> 16) & 0xFF;
        let green = (color >> 8) & 0xFF;
        let blue = color & 0xFF;
        for (let i = 0; i < primeNumLeds; i++) {
            setPrimeLedColorRaw(i, red, green, blue);
        }
        showPrimeBuffer();
    }

    /**
 * Set color of a specific LED on the strip
 * @param ledIndex the index of the LED to change
 * @param color the color to set
 */
    //% subcategory="Prime"
    //% value.defl='#ff0000'
    //% group="Neo_Color"
    //% blockId="one_bit_prime_set_led_color"
    //% block="set Prime LED %ledIndex|color to %color"
    //% weight=110 blockGap=8
    //% color.shadow="brightColorNumberPicker"
    export function setPrimeLedColor(ledIndex: number, color: number): void {
        if (primeBuffer && ledIndex < primeNumLeds) {
            let red = (color >> 16) & 0xFF;
            let green = (color >> 8) & 0xFF;
            let blue = color & 0xFF;

            let index = ledIndex * 3; // Calculate position in buffer
            primeBuffer.setUint8(index, (red * primeBrightness) >> 8); // Scale brightness
            primeBuffer.setUint8(index + 1, (green * primeBrightness) >> 8); // Scale brightness
            primeBuffer.setUint8(index + 2, (blue * primeBrightness) >> 8); // Scale brightness

            showPrimeBuffer(); // Send updated buffer to the LEDs
        }
    }


    /**
     * Set brightness of the strip
     * @param brightness brightness level (0-255)
     */
    //% subcategory="Prime"
    //% group="Neo_Color"
    //% blockId="one_bit_prime_set_brightness"
    //% block="set Prime brightness to %brightness"
    //% weight=100 blockGap=8
    export function setPrimeBrightness(brightness: number): void {
        primeBrightness = Math.clamp(0, 255, brightness);
        applyBrightness(); // Apply brightness scaling to the buffer
        showPrimeBuffer(); // Update LEDs with adjusted brightness
    }

    /**
     * Apply brightness scaling to the buffer
     */
    function applyBrightness(): void {
        if (!primeBuffer) return;

        for (let i = 0; i < primeNumLeds; i++) {
            let index = i * 3;
            primeBuffer[index] = (primeBuffer[index] * primeBrightness) >> 8; // Scale Green
            primeBuffer[index + 1] = (primeBuffer[index + 1] * primeBrightness) >> 8; // Scale Red
            primeBuffer[index + 2] = (primeBuffer[index + 2] * primeBrightness) >> 8; // Scale Blue
        }
    }
    /**
     * Set color of a specific LED using raw RGB values
     * @param ledIndex the index of the LED to change
     * @param red Red value (0-255)
     * @param green Green value (0-255)
     * @param blue Blue value (0-255)
     */
    function setPrimeLedColorRaw(index: number, red: number, green: number, blue: number): void {
        if (!primeBuffer || index >= primeNumLeds) return;

        let brightnessScale = primeBrightness / 255; // Scale factor for brightness
        primeBuffer[index * 3 + 0] = Math.floor(green * brightnessScale); // GRB: Green
        primeBuffer[index * 3 + 1] = Math.floor(red * brightnessScale);   // GRB: Red
        primeBuffer[index * 3 + 2] = Math.floor(blue * brightnessScale);  // GRB: Blue
    }

    /**
     * Show a gradient pattern on the strip
     * @param startHue the starting hue value (0-360)
     * @param length the length of the gradient in number of LEDs
     * @param fromColor starting color of the gradient
     * @param toColor ending color of the gradient
     */
    //% subcategory="Prime"
    //% value.defl='#ff0000' 
    //% group="Neo_Color"
    //% blockId="one_bit_prime_gradient"
    //% block="show gradient with start hue %startHue|length %length|from %fromColor|to %toColor"
    //% weight=90 blockGap=8
    //% fromColor.shadow="brightColorNumberPicker" 
    //% toColor.shadow="brightColorNumberPicker"
    export function showPrimeGradient(startHue: number, length: number, fromColor: number, toColor: number): void {
        for (let i = 0; i < length; i++) {
            let blendColor = blend(fromColor, toColor, i / length);
            setLedColor(i, blendColor); // Custom function to set LED color
        }
        updateLeds(); // Custom function to apply changes
    }


    /**
     * Helper function to blend two colors
     * @param color1 the first color
     * @param color2 the second color
     * @param blend the blend factor between the two colors (0-1)
     */
    function blend(color1: number, color2: number, blend: number): number {
        let r1 = (color1 >> 16) & 0xFF;
        let g1 = (color1 >> 8) & 0xFF;
        let b1 = color1 & 0xFF;

        let r2 = (color2 >> 16) & 0xFF;
        let g2 = (color2 >> 8) & 0xFF;
        let b2 = color2 & 0xFF;

        let r = Math.round(r1 * (1 - blend) + r2 * blend);
        let g = Math.round(g1 * (1 - blend) + g2 * blend);
        let b = Math.round(b1 * (1 - blend) + b2 * blend);

        return (r << 16) | (g << 8) | b;
    }



    /**
     * Custom color picker with all specified colors
     */
    //% subcategory="Prime"
    //% value.defl='#CCFF00'
    //% group="Neo_Color"
    //% weight=80 blockGap=20
    //% blockId=brightColorNumberPicker block="%value"
    //% shim=TD_ID colorSecondary="#FFFFFF"
    //% value.fieldEditor="colornumber" value.fieldOptions.decompileLiterals=true
    //% value.fieldOptions.colours='["#CCFF00","#CCCC00","#CC9900","#CC6600","#CC3300","#CC0000","#660000","#663300","#666600","#669900","#66CC00","#66FF00","#00FF00","#00CC00","#009900","#006600","#003300","#000000","#CCFF33","#CCCC33","#CC9933","#CC6633","#CC3333","#CC0033","#660033","#663333","#666633","#669933","#66CC33","#66FF33","#00FF33","#00CC33","#009933","#006633","#003333","#000033","#CCFF66","#CCCC66","#CC9966","#CC6666","#CC3366","#CC0066","#660066","#663366","#666666","#669966","#66CC66","#66FF66","#00FF66","#00CC66","#009966","#006666","#003366","#000066","#CCFF99","#CCCC99","#CC9999","#CC6699","#CC3399","#CC0099","#660099","#663399","#666699","#669999","#66CC99","#66FF99","#00FF99","#00CC99","#009999","#006699","#003399","#000099","#CCFFCC","#CCCCCC","#CC99CC","#CC66CC","#CC33CC","#CC00CC","#6600CC","#6633CC","#6666CC","#6699CC","#66CCCC","#66FFCC","#00FFCC","#00CCCC","#0099CC","#0066CC","#0033CC","#0000CC","#CCFFFF","#CCCCFF","#CC99FF","#CC66FF","#CC33FF","#CC00FF","#6600FF","#6633FF","#6666FF","#6699FF","#66CCFF","#66FFFF","#00FFFF","#00CCFF","#0099FF","#0066FF","#0033FF","#0000FF","#FFFFFF","#FFCCFF","#FF99FF","#FF66FF","#FF33FF","#FF00FF","#9900FF","#9933FF","#9966FF","#9999FF","#99CCFF","#99FFFF","#33FFFF","#33CCFF","#3399FF","#3366FF","#3333FF","#3300FF","#FFFFCC","#FFCCCC","#FF99CC","#FF66CC","#FF33CC","#FF00CC","#9900CC","#9933CC","#9966CC","#9999CC","#99CCCC","#99FFCC","#33FFCC","#33CCCC","#3399CC","#3366CC","#3333CC","#3300CC","#FFFF99","#FFCC99","#FF9999","#FF6699","#FF3399","#FF0099","#990099","#993399","#996699","#999999","#99CC99","#99FF99","#33FF99","#33CC99","#339999","#336699","#333399","#330099","#FFFF66","#FFCC66","#FF9966","#FF6666","#FF3366","#FF0066","#990066","#993366","#996666","#999966","#99CC66","#99FF66","#33FF66","#33CC66","#339966","#336666","#333366","#330066","#FFFF33","#FFCC33","#FF9933","#FF6633","#FF3333","#FF0033","#990033","#993333","#996633","#999933","#99CC33","#99FF33","#33FF33","#33CC33","#339933","#336633","#333333","#330033"]'
    //% value.fieldOptions.columns=18 value.fieldOptions.className='rgbColorPicker'
    export function __colorNumberPicker(value: number): number {
        return value;
    }


    /**
     * Get a random color
     */
    //% blockId="one_bit_prime_random_color"
    //% value.defl='#ff0000' 
    //% group="Neo_Color" weight=70
    //% block="random color"
    //% subcategory="Prime"
    export function primeRandomColor(): number {
        return Math.randomRange(0, 0xFFFFFF);
    }


    /**
     * Convert RGB values to a color number
     * @param r Red value (0-255)
     * @param g Green value (0-255)
     * @param b Blue value (0-255)
     */
    //% blockId="one_bit_prime_rgb_to_color"
    //% value.defl='#ff0000' 
    //% group="Neo_Color" weight=60
    //% block="R %r|G %g|B %b"
    //% r.min=0 r.max=255
    //% g.min=0 g.max=255
    //% b.min=0 b.max=255
    //% subcategory="Prime"
    export function primeRgbToColor(r: number, g: number, b: number): number {
        return (r << 16) | (g << 8) | b;
    }

    /**
     * Convert HSL values to a color number
     * @param h Hue (0-360)
     * @param s Saturation (0-100)
     * @param l Luminosity (0-100)
     */
    //% blockId="one_bit_prime_hsl_to_color"
    //% value.defl='#ff0000' 
    //% group="Neo_Color" weight=50
    //% block="hue %h|saturation %s|luminosity %l"
    //% h.min=0 h.max=360
    //% s.min=0 s.max=100
    //% l.min=0 l.max=100
    //% subcategory="Prime"
    export function primeHslToColor(h: number, s: number, l: number): number {
        return hslToRgb(h, s, l); // Custom function for HSL to RGB
    }

    /**
 * Convert HSL values to RGB
 * @param h Hue (0-360)
 * @param s Saturation (0-100)
 * @param l Luminosity (0-100)
 * @returns A packed RGB number (24-bit)
 */
    function hslToRgb(h: number, s: number, l: number): number {
        h = h % 360; // Ensure hue wraps around 360
        s = s / 100; // Convert saturation to a decimal
        l = l / 100; // Convert luminosity to a decimal

        const c = (1 - Math.abs(2 * l - 1)) * s; // Chroma
        const x = c * (1 - Math.abs((h / 60) % 2 - 1)); // Second largest component
        const m = l - c / 2;

        let r = 0, g = 0, b = 0;

        if (h >= 0 && h < 60) {
            r = c; g = x; b = 0;
        } else if (h >= 60 && h < 120) {
            r = x; g = c; b = 0;
        } else if (h >= 120 && h < 180) {
            r = 0; g = c; b = x;
        } else if (h >= 180 && h < 240) {
            r = 0; g = x; b = c;
        } else if (h >= 240 && h < 300) {
            r = x; g = 0; b = c;
        } else if (h >= 300 && h < 360) {
            r = c; g = 0; b = x;
        }

        // Convert RGB components to 8-bit values and pack into a single integer
        const red = Math.round((r + m) * 255);
        const green = Math.round((g + m) * 255);
        const blue = Math.round((b + m) * 255);

        return (red << 16) | (green << 8) | blue;
    }


    /**
     * Custom function to set a specific LED's color
     * @param index LED index
     * @param color RGB color
     */
    function setLedColor(index: number, color: number): void {
        // Send the appropriate signal to the LEDs
        let r = (color >> 16) & 0xFF;
        let g = (color >> 8) & 0xFF;
        let b = color & 0xFF;

        // Logic to send r, g, and b to the specific LED
        sendSignalToLed(index, r, g, b);
    }

    /**
     * Function to send RGB signal to a specific LED
     */
    function sendSignalToLed(index: number, r: number, g: number, b: number): void {
        // Use custom bit-banging logic or timing logic here
    }

    /**
     * Function to apply updates to the LEDs
     */
    function updateLeds(): void {
        // Trigger any necessary latch or update commands for the LEDs
    }



    ////////////////////
    // Ultrasonic BLOCKS //
    ////////////////////

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

    ////////////////////
    // I2C_Oled //
    ////////////////////

    let _I2CAddr = 0x3C; // Default I2C address for OLED
    let _screen = pins.createBuffer(1025); // Screen buffer
    _screen[0] = 0x40; // Control byte for data

    // Full 5x7 font for ASCII 32-127 (including lowercase a-z)
    const font: number[] = [
        // ASCII 32-127 (printable characters)
        0x00, 0x00, 0x00, 0x00, 0x00, // Space
        0x00, 0x00, 0x5F, 0x00, 0x00, // !
        0x00, 0x03, 0x00, 0x03, 0x00, // "
        0x14, 0x7F, 0x14, 0x7F, 0x14, // #
        0x24, 0x2A, 0x7F, 0x2A, 0x12, // $
        0x23, 0x13, 0x08, 0x64, 0x62, // %
        0x36, 0x49, 0x55, 0x22, 0x50, // &
        0x00, 0x05, 0x03, 0x00, 0x00, // '
        0x00, 0x1C, 0x22, 0x41, 0x00, // (
        0x00, 0x41, 0x22, 0x1C, 0x00, // )
        0x14, 0x08, 0x3E, 0x08, 0x14, // *
        0x08, 0x08, 0x3E, 0x08, 0x08, // +
        0x00, 0x50, 0x30, 0x00, 0x00, // ,
        0x08, 0x08, 0x08, 0x08, 0x08, // -
        0x00, 0x60, 0x60, 0x00, 0x00, // .
        0x20, 0x10, 0x08, 0x04, 0x02, // /
        0x3E, 0x51, 0x49, 0x45, 0x3E, // 0
        0x00, 0x42, 0x7F, 0x40, 0x00, // 1
        0x42, 0x61, 0x51, 0x49, 0x46, // 2
        0x21, 0x41, 0x45, 0x4B, 0x31, // 3
        0x18, 0x14, 0x12, 0x7F, 0x10, // 4
        0x27, 0x45, 0x45, 0x45, 0x39, // 5
        0x3C, 0x4A, 0x49, 0x49, 0x30, // 6
        0x01, 0x71, 0x09, 0x05, 0x03, // 7
        0x36, 0x49, 0x49, 0x49, 0x36, // 8
        0x06, 0x49, 0x49, 0x29, 0x1E, // 9
        0x00, 0x36, 0x36, 0x00, 0x00, // :
        0x00, 0x56, 0x36, 0x00, 0x00, // ;
        0x08, 0x14, 0x22, 0x41, 0x00, // <
        0x14, 0x14, 0x14, 0x14, 0x14, // =
        0x00, 0x41, 0x22, 0x14, 0x08, // >
        0x02, 0x01, 0x51, 0x09, 0x06, // ?
        0x3E, 0x41, 0x5D, 0x55, 0x1E, // @
        0x7E, 0x11, 0x11, 0x11, 0x7E, // A
        0x7F, 0x49, 0x49, 0x49, 0x36, // B
        0x3E, 0x41, 0x41, 0x41, 0x22, // C
        0x7F, 0x41, 0x41, 0x22, 0x1C, // D
        0x7F, 0x49, 0x49, 0x49, 0x41, // E
        0x7F, 0x09, 0x09, 0x09, 0x01, // F
        0x3E, 0x41, 0x49, 0x49, 0x7A, // G
        0x7F, 0x08, 0x08, 0x08, 0x7F, // H
        0x00, 0x41, 0x7F, 0x41, 0x00, // I
        0x20, 0x40, 0x41, 0x3F, 0x01, // J
        0x7F, 0x08, 0x14, 0x22, 0x41, // K
        0x7F, 0x40, 0x40, 0x40, 0x40, // L
        0x7F, 0x02, 0x0C, 0x02, 0x7F, // M
        0x7F, 0x04, 0x08, 0x10, 0x7F, // N
        0x3E, 0x41, 0x41, 0x41, 0x3E, // O
        0x7F, 0x09, 0x09, 0x09, 0x06, // P
        0x3E, 0x41, 0x51, 0x21, 0x5E, // Q
        0x7F, 0x09, 0x19, 0x29, 0x46, // R
        0x46, 0x49, 0x49, 0x49, 0x31, // S
        0x01, 0x01, 0x7F, 0x01, 0x01, // T
        0x3F, 0x40, 0x40, 0x40, 0x3F, // U
        0x1F, 0x20, 0x40, 0x20, 0x1F, // V
        0x3F, 0x40, 0x38, 0x40, 0x3F, // W
        0x63, 0x14, 0x08, 0x14, 0x63, // X
        0x07, 0x08, 0x70, 0x08, 0x07, // Y
        0x61, 0x51, 0x49, 0x45, 0x43, // Z
        0x00, 0x7F, 0x41, 0x41, 0x00, // [
        0x02, 0x04, 0x08, 0x10, 0x20, // Backslash
        0x00, 0x41, 0x41, 0x7F, 0x00, // ]
        0x04, 0x02, 0x01, 0x02, 0x04, // ^
        0x40, 0x40, 0x40, 0x40, 0x40, // _
        0x00, 0x03, 0x05, 0x00, 0x00, // `
        // Lowercase letters a-z (ASCII 97-122)
        0x3E, 0x51, 0x49, 0x49, 0x3E, // a
        0x7F, 0x49, 0x49, 0x49, 0x36, // b
        0x3E, 0x41, 0x41, 0x41, 0x22, // c
        0x7F, 0x41, 0x41, 0x22, 0x1C, // d
        0x3E, 0x49, 0x49, 0x49, 0x30, // e
        0x7F, 0x09, 0x09, 0x09, 0x01, // f
        0x36, 0x49, 0x49, 0x49, 0x3E, // g
        0x7F, 0x08, 0x08, 0x08, 0x7F, // h
        0x00, 0x49, 0x7F, 0x49, 0x00, // i
        0x20, 0x40, 0x49, 0x3F, 0x01, // j
        0x7F, 0x08, 0x14, 0x22, 0x41, // k
        0x00, 0x41, 0x7F, 0x40, 0x00, // l
        0x7F, 0x02, 0x0C, 0x02, 0x7F, // m
        0x7F, 0x04, 0x08, 0x10, 0x7F, // n
        0x3E, 0x41, 0x41, 0x41, 0x3E, // o
        0x7F, 0x09, 0x09, 0x09, 0x06, // p
        0x3E, 0x41, 0x51, 0x21, 0x5E, // q
        0x7F, 0x09, 0x19, 0x29, 0x46, // r
        0x46, 0x49, 0x49, 0x49, 0x31, // s
        0x01, 0x01, 0x7F, 0x01, 0x01, // t
        0x3F, 0x40, 0x40, 0x40, 0x3F, // u
        0x1F, 0x20, 0x40, 0x20, 0x1F, // v
        0x3F, 0x40, 0x38, 0x40, 0x3F, // w
        0x63, 0x14, 0x08, 0x14, 0x63, // x
        0x07, 0x08, 0x70, 0x08, 0x07, // y
        0x61, 0x51, 0x49, 0x45, 0x43, // z
        0x00, 0x41, 0x41, 0x7F, 0x00, // {
        0x00, 0x00, 0x7F, 0x00, 0x00, // |
        0x00, 0x7F, 0x41, 0x41, 0x00, // }
        0x10, 0x20, 0x10, 0x20, 0x10, // ~
    ];



    /**
     * Initializes the OLED display.
     * @param address I2C address of the OLED, eg: 60
     */
    //% blockId="I2C_OLED_INIT" block="initialize OLED at I2C address %address"
    //% subcategory="I2C OLED"
    //% weight=100
    export function init(address: number = 0x3C): void {
        _I2CAddr = address;
        _screen.fill(0);
        const initCommands = [
            0xAE, // Display off
            0xD5, 0x80, // Set display clock divide ratio/oscillator frequency
            0xA8, 0x3F, // Set multiplex ratio (1 to 64)
            0xD3, 0x00, // Set display offset
            0x40, // Set start line address
            0x8D, 0x14, // Enable charge pump
            0x20, 0x00, // Set memory addressing mode to horizontal
            0xA1, // Set segment re-map
            0xC8, // Set COM output scan direction
            0xDA, 0x12, // Set COM pins hardware configuration
            0x81, 0xCF, // Set contrast control
            0xD9, 0xF1, // Set pre-charge period
            0xDB, 0x40, // Set VCOMH deselect level
            0xA4, // Entire display ON
            0xA6, // Set normal display mode
            0xAF // Display ON
        ];
        for (let cmd of initCommands) {
            cmd1(cmd);
        }
        clear();
        refresh();
    }

    function cmd1(d: number): void {
        pins.i2cWriteNumber(_I2CAddr, 0x00 | d, NumberFormat.UInt16BE);
    }

    function set_pos(col: number, page: number): void {
        cmd1(0xB0 | page); // Set page address
        cmd1(0x00 | (col & 0x0F)); // Set lower column start address
        cmd1(0x10 | (col >> 4)); // Set higher column start address
    }

    /**
     * Clears the OLED display.
     */
    //% blockId="I2C_OLED_CLEAR" block="clear OLED"
    //% subcategory="I2C OLED"
    //% weight=95
    export function clear(): void {
        _screen.fill(0, 1); // Clear screen buffer
    }

    /**
     * Refreshes the OLED display with the current buffer.
     */
    //% blockId="I2C_OLED_REFRESH" block="refresh OLED"
    //% subcategory="I2C OLED"
    //% weight=94
    export function refresh(): void {
        for (let i = 0; i < 8; i++) {
            set_pos(0, i);
            let buf = _screen.slice(1 + i * 128, 1 + (i + 1) * 128);
            buf[0] = 0x40; // Control byte for data
            pins.i2cWriteBuffer(_I2CAddr, buf);
        }
    }

    /**
     * Draws a pixel at (x, y).
     * @param x X-coordinate, eg: 0
     * @param y Y-coordinate, eg: 0
     * @param color 1 for white, 0 for black, eg: 1
     */
    //% blockId="I2C_OLED_PIXEL" block="draw pixel at x %x|y %y|color %color"
    //% subcategory="I2C OLED"
    //% weight=85
    export function drawPixel(x: number, y: number, color: number = 1): void {
        if (x < 0 || x >= 128 || y < 0 || y >= 64) return; // Check bounds
        let page = Math.floor(y / 8);
        let shift = y % 8;
        let index = x + page * 128 + 1; // Adjust for screen buffer
        if (color) {
            _screen[index] |= (1 << shift); // Set pixel
        } else {
            _screen[index] &= ~(1 << shift); // Clear pixel
        }
    }

    /**
     * Displays text on the OLED screen.
     * @param x X-coordinate, eg: 0
     * @param y Y-coordinate, eg: 0
     * @param text Text to display, eg: "Hello!"
     * @param color 1 for white, 0 for black, eg: 1
     */
    //% blockId="I2C_OLED_TEXT" block="show text at x %x|y %y|text %text|color %color"
    //% subcategory="I2C OLED"
    //% weight=90
    export function showText(x: number, y: number, text: string, color: number = 1): void {
        for (let i = 0; i < text.length; i++) {
            drawChar(x + i * 6, y, text.charCodeAt(i), color);
        }
        refresh();
    }

    function drawChar(x: number, y: number, charCode: number, color: number): void {
        if (charCode < 32 || charCode > 127) return; // Check bounds
        let index = (charCode - 32) * 5; // Font index
        for (let i = 0; i < 5; i++) {
            let line = font[index + i];
            for (let j = 0; j < 8; j++) {
                if (line & (1 << j)) {
                    drawPixel(x + i, y + j, color);
                }
            }
        }
    }

}
