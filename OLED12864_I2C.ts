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

    {
        let font: number[] = [];
        font[0] = 0x0022d422;
        font[1] = 0x0022d422;
        font[2] = 0x0022d422;
        font[3] = 0x0022d422;
        font[4] = 0x0022d422;
        font[5] = 0x0022d422;
        font[6] = 0x0022d422;
        font[7] = 0x0022d422;
        font[8] = 0x0022d422;
        font[9] = 0x0022d422;
        font[10] = 0x0022d422;
        font[11] = 0x0022d422;
        font[12] = 0x0022d422;
        font[13] = 0x0022d422;
        font[14] = 0x0022d422;
        font[15] = 0x0022d422;
        font[16] = 0x0022d422;
        font[17] = 0x0022d422;
        font[18] = 0x0022d422;
        font[19] = 0x0022d422;
        font[20] = 0x0022d422;
        font[21] = 0x0022d422;
        font[22] = 0x0022d422;
        font[23] = 0x0022d422;
        font[24] = 0x0022d422;
        font[25] = 0x0022d422;
        font[26] = 0x0022d422;
        font[27] = 0x0022d422;
        font[28] = 0x0022d422;
        font[29] = 0x0022d422;
        font[30] = 0x0022d422;
        font[31] = 0x0022d422;
        font[32] = 0x00000000;
        font[33] = 0x000002e0;
        font[34] = 0x00018060;
        font[35] = 0x00afabea;
        font[36] = 0x00aed6ea;
        font[37] = 0x01991133;
        font[38] = 0x010556aa;
        font[39] = 0x00000060;
        font[40] = 0x000045c0;
        font[41] = 0x00003a20;
        font[42] = 0x00051140;
        font[43] = 0x00023880;
        font[44] = 0x00002200;
        font[45] = 0x00021080;
        font[46] = 0x00000100;
        font[47] = 0x00111110;
        font[48] = 0x0007462e;
        font[49] = 0x00087e40;
        font[50] = 0x000956b9;
        font[51] = 0x0005d629;
        font[52] = 0x008fa54c;
        font[53] = 0x009ad6b7;
        font[54] = 0x008ada88;
        font[55] = 0x00119531;
        font[56] = 0x00aad6aa;
        font[57] = 0x0022b6a2;
        font[58] = 0x00000140;
        font[59] = 0x00002a00;
        font[60] = 0x0008a880;
        font[61] = 0x00052940;
        font[62] = 0x00022a20;
        font[63] = 0x0022d422;
        font[64] = 0x00e4d62e;
        font[65] = 0x000f14be;
        font[66] = 0x000556bf;
        font[67] = 0x0008c62e;
        font[68] = 0x0007463f;
        font[69] = 0x0008d6bf;
        font[70] = 0x000094bf;
        font[71] = 0x00cac62e;
        font[72] = 0x000f909f;
        font[73] = 0x000047f1;
        font[74] = 0x0017c629;
        font[75] = 0x0008a89f;
        font[76] = 0x0008421f;
        font[77] = 0x01f1105f;
        font[78] = 0x01f4105f;
        font[79] = 0x0007462e;
        font[80] = 0x000114bf;
        font[81] = 0x000b6526;
        font[82] = 0x010514bf;
        font[83] = 0x0004d6b2;
        font[84] = 0x0010fc21;
        font[85] = 0x0007c20f;
        font[86] = 0x00744107;
        font[87] = 0x01f4111f;
        font[88] = 0x000d909b;
        font[89] = 0x00117041;
        font[90] = 0x0008ceb9;
        font[91] = 0x0008c7e0;
        font[92] = 0x01041041;
        font[93] = 0x000fc620;
        font[94] = 0x00010440;
        font[95] = 0x01084210;
        font[96] = 0x00000820;
        font[97] = 0x010f4a4c;
        font[98] = 0x0004529f;
        font[99] = 0x00094a4c;
        font[100] = 0x000fd288;
        font[101] = 0x000956ae;
        font[102] = 0x000097c4;
        font[103] = 0x0007d6a2;
        font[104] = 0x000c109f;
        font[105] = 0x000003a0;
        font[106] = 0x0006c200;
        font[107] = 0x0008289f;
        font[108] = 0x000841e0;
        font[109] = 0x01e1105e;
        font[110] = 0x000e085e;
        font[111] = 0x00064a4c;
        font[112] = 0x0002295e;
        font[113] = 0x000f2944;
        font[114] = 0x0001085c;
        font[115] = 0x00012a90;
        font[116] = 0x010a51e0;
        font[117] = 0x010f420e;
        font[118] = 0x00644106;
        font[119] = 0x01e8221e;
        font[120] = 0x00093192;
        font[121] = 0x00222292;
        font[122] = 0x00095b52;
        font[123] = 0x0008fc80;
        font[124] = 0x000003e0;
        font[125] = 0x000013f1;
        font[126] = 0x00841080;
        font[127] = 0x0022d422;

        let _I2CAddr = 0;
        let _screen = pins.createBuffer(1025);
        let _buf2 = pins.createBuffer(2);
        let _buf3 = pins.createBuffer(3);
        let _buf4 = pins.createBuffer(4);
        let _ZOOM = 1;

        function cmd1(d: number) {
            let n = d % 256;
            pins.i2cWriteNumber(_I2CAddr, n, NumberFormat.UInt16BE);
        }

        function cmd2(d1: number, d2: number) {
            _buf3[0] = 0;
            _buf3[1] = d1;
            _buf3[2] = d2;
            pins.i2cWriteBuffer(_I2CAddr, _buf3);
        }

        function cmd3(d1: number, d2: number, d3: number) {
            _buf4[0] = 0;
            _buf4[1] = d1;
            _buf4[2] = d2;
            _buf4[3] = d3;
            pins.i2cWriteBuffer(_I2CAddr, _buf4);
        }

        function set_pos(col: number = 0, page: number = 0) {
            cmd1(0xb0 | page); // page number
            let c = col * (_ZOOM + 1);
            cmd1(0x00 | c % 16); // lower start column address
            cmd1(0x10 | (c >> 4)); // upper start column address
        }

        // clear bit
        function clrbit(d: number, b: number): number {
            if (d & (1 << b)) d -= 1 << b;
            return d;
        }

        /**
         * set pixel in OLED
         * @param x is X alis, eg: 0
         * @param y is Y alis, eg: 0
         * @param color is dot color, eg: 1
         */
        //% blockId="OLED12864_I2C_PIXEL" block="set pixel at x %x|y %y|color %color"
        //% subcategory="OLED"
        //% weight=70 blockGap=8
        //% parts=OLED12864_I2C trackArgs=0
        function pixel(x: number, y: number, color: number = 1) {
            let page = y >> 3;
            let shift_page = y % 8;
            let ind = x * (_ZOOM + 1) + page * 128 + 1;
            let b = color
                ? _screen[ind] | (1 << shift_page)
                : clrbit(_screen[ind], shift_page);
            _screen[ind] = b;
            set_pos(x, page);
            if (_ZOOM) {
                _screen[ind + 1] = b;
                _buf3[0] = 0x40;
                _buf3[1] = _buf3[2] = b;
                pins.i2cWriteBuffer(_I2CAddr, _buf3);
            } else {
                _buf2[0] = 0x40;
                _buf2[1] = b;
                pins.i2cWriteBuffer(_I2CAddr, _buf2);
            }
        }

        /**
         * show text in OLED
         * @param x is X alis, eg: 0
         * @param y is Y alis, eg: 0
         * @param s is the text will be show, eg: 'Hello!'
         * @param color is string color, eg: 1
         */
        //% blockId="OLED12864_I2C_SHOWSTRING" block="show string at x %x|y %y|text %s|color %color"
        //% subcategory="OLED"
        //% weight=80 blockGap=8
        //% parts=OLED12864_I2C trackArgs=0
         function showString(
            x: number,
            y: number,
            s: string,
            color: number = 1
        ) {
            let col = 0;
            let p = 0;
            let ind = 0;
            for (let n = 0; n < s.length; n++) {
                p = font[s.charCodeAt(n)];
                for (let i = 0; i < 5; i++) {
                    col = 0;
                    for (let j = 0; j < 5; j++) {
                        if (p & (1 << (5 * i + j))) col |= 1 << (j + 1);
                    }
                    ind = (x + n) * 5 * (_ZOOM + 1) + y * 128 + i * (_ZOOM + 1) + 1;
                    if (color == 0) col = 255 - col;
                    _screen[ind] = col;
                    if (_ZOOM) _screen[ind + 1] = col;
                }
            }
            set_pos(x * 5, y);
            let ind0 = x * 5 * (_ZOOM + 1) + y * 128;
            let buf = _screen.slice(ind0, ind + 1);
            buf[0] = 0x40;
            pins.i2cWriteBuffer(_I2CAddr, buf);
        }

        /**
         * show a number in OLED
         * @param x is X alis, eg: 0
         * @param y is Y alis, eg: 0
         * @param num is the number will be show, eg: 12
         * @param color is number color, eg: 1
         */
        //% blockId="OLED12864_I2C_NUMBER" block="show a Number at x %x|y %y|number %num|color %color"
        //% subcategory="OLED"
        //% weight=80 blockGap=8
        //% parts=OLED12864_I2C trackArgs=0
         function showNumber(
            x: number,
            y: number,
            num: number,
            color: number = 1
        ) {
            showString(x, y, num.toString(), color);
        }

        /**
         * draw a horizontal line
         * @param x is X alis, eg: 0
         * @param y is Y alis, eg: 0
         * @param len is the length of line, eg: 10
         * @param color is line color, eg: 1
         */
        //% blockId="OLED12864_I2C_HLINE" block="draw a horizontal line at x %x|y %y|number %len|color %color"
        //% subcategory="OLED"
        //% weight=71 blockGap=8
        //% parts=OLED12864_I2C trackArgs=0
         function hline(x: number, y: number, len: number, color: number = 1) {
            for (let i = x; i < x + len; i++) pixel(i, y, color);
        }

        /**
         * draw a vertical line
         * @param x is X alis, eg: 0
         * @param y is Y alis, eg: 0
         * @param len is the length of line, eg: 10
         * @param color is line color, eg: 1
         */
        //% blockId="OLED12864_I2C_VLINE" block="draw a vertical line at x %x|y %y|number %len|color %color"
        //% subcategory="OLED"
        //% weight=72 blockGap=8
        //% parts=OLED12864_I2C trackArgs=0
         function vline(x: number, y: number, len: number, color: number = 1) {
            for (let i = y; i < y + len; i++) pixel(x, i, color);
        }

        /**
         * draw a rectangle
         * @param x1 is X alis, eg: 0
         * @param y1 is Y alis, eg: 0
         * @param x2 is X alis, eg: 60
         * @param y2 is Y alis, eg: 30
         * @param color is line color, eg: 1
         */
        //% blockId="OLED12864_I2C_RECT" block="draw a rectangle at x1 %x1|y1 %y1|x2 %x2|y2 %y2|color %color"
        //% subcategory="OLED"
        //% weight=73 blockGap=8
        //% parts=OLED12864_I2C trackArgs=0
        function rect(
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            color: number = 1
        ) {
            if (x1 > x2) x1 = [x2, (x2 = x1)][0];
            if (y1 > y2) y1 = [y2, (y2 = y1)][0];
            hline(x1, y1, x2 - x1 + 1, color);
            hline(x1, y2, x2 - x1 + 1, color);
            vline(x1, y1, y2 - y1 + 1, color);
            vline(x2, y1, y2 - y1 + 1, color);
        }

        /**
         * invert display
         * @param d true: invert / false: normal, eg: true
         */
        //% blockId="OLED12864_I2C_INVERT" block="invert display %d"
        //% subcategory="OLED"
        //% weight=65 blockGap=8
        //% parts=OLED12864_I2C trackArgs=0
         function invert(d: boolean = true) {
            let n = d ? 0xa7 : 0xa6;
            cmd1(n);
        }

        /**
         * draw / redraw screen
         */
        //% blockId="OLED12864_I2C_DRAW" block="draw"
        //% weight=64 blockGap=8
        //% subcategory="OLED"
        //% parts=OLED12864_I2C trackArgs=0
         function draw() {
            set_pos();
            pins.i2cWriteBuffer(_I2CAddr, _screen);
        }

        /**
         * clear screen
         */
        //% blockId="OLED12864_I2C_CLEAR" block="clear"
        //% subcategory="OLED"
        //% weight=63 blockGap=8
        //% parts=OLED12864_I2C trackArgs=0
         function clear() {
            _screen.fill(0);
            _screen[0] = 0x40;
            draw();
        }

        /**
         * turn on screen
         */
        //% blockId="OLED12864_I2C_ON" block="turn on"
        //% subcategory="OLED"
        //% weight=62 blockGap=8
        //% parts=OLED12864_I2C trackArgs=0
         function on() {
            cmd1(0xaf);
        }

        /**
         * turn off screen
         */
        //% blockId="OLED12864_I2C_OFF" block="turn off"
        //% subcategory="OLED"
        //% weight=61 blockGap=8
        //% parts=OLED12864_I2C trackArgs=0
         function off() {
            cmd1(0xae);
        }

        /**
         * zoom mode
         * @param d true zoom / false normal, eg: true
         */
        //% blockId="OLED12864_I2C_ZOOM" block="zoom %d"
        //% subcategory="OLED"
        //% weight=60 blockGap=8
        //% parts=OLED12864_I2C trackArgs=0
         function zoom(d: boolean = true) {
            _ZOOM = d ? 1 : 0;
            cmd2(0xd6, _ZOOM);
        }
        /**
         * draw an outlined circle
         * @param x is the x coordinate of the center, eg: 0
         * @param y is the y coordinate of the center, eg: 0
         * @param r is the radius of the circle, eg: 10
         * @param color is the color of the circle, eg: 1
         */
        //% blockId="OLED12864_I2C_OUTLINEDCIRCLE"
        //% block="draw outlined circle at x %x|y %y|radius %r|color %color"
        //% subcategory="OLED"
        //% weight=70 blockGap=8
        //% parts=OLED12864_I2C trackArgs=0
         function outlinedCircle(x: number, y: number, r: number, color: number = 1) {
            const step = 1 / r;
            for (let theta = 0; theta < 2 * Math.PI; theta += step) {
                let xPos = x + Math.round(r * Math.cos(theta));
                let yPos = y + Math.round(r * Math.sin(theta));
                pixel(xPos, yPos, color);
            }
        }
        /**
         * draw a filled circle
         * @param x is the x coordinate of the center, eg: 0
         * @param y is the y coordinate of the center, eg: 0
         * @param r is the radius of the circle, eg: 10
         * @param color is the color of the circle, eg: 1
         */
        //% blockId="OLED12864_I2C_FILLEDCIRCLE"
        //% block="draw filled circle at x %x|y %y|radius %r|color %color"
        //% subcategory="OLED"
        //% parts=OLED12864_I2C trackArgs=0
         function filledCircle(x: number, y: number, r: number, color: number = 1) {
            for (let j = 0; j <= r; j++) {
                const step = 1 / j;
                for (let theta = 0; theta < 2 * Math.PI; theta += step) {
                    let xPos = x + Math.round(j * Math.cos(theta));
                    let yPos = y + Math.round(j * Math.sin(theta));
                    pixel(xPos, yPos, color);
                }
            }
        }
        /**
         * OLED initialize
         * @param addr is i2c addr, eg: 60
         */
        //% blockId="OLED12864_I2C_init" block="init OLED with addr %addr"
        //% subcategory="OLED"
        //% weight=100 blockGap=8
        //% parts=OLED12864_I2C trackArgs=0
         function init(addr: number) {
            _I2CAddr = addr;
            cmd1(0xae); // SSD1306_DISPLAYOFF
            cmd1(0xa4); // SSD1306_DISPLAYALLON_RESUME
            cmd2(0xd5, 0xf0); // SSD1306_SETDISPLAYCLOCKDIV
            cmd2(0xa8, 0x3f); // SSD1306_SETMULTIPLEX
            cmd2(0xd3, 0x00); // SSD1306_SETDISPLAYOFFSET
            cmd1(0 | 0x0); // line #SSD1306_SETSTARTLINE
            cmd2(0x8d, 0x14); // SSD1306_CHARGEPUMP
            cmd2(0x20, 0x00); // SSD1306_MEMORYMODE
            cmd3(0x21, 0, 127); // SSD1306_COLUMNADDR
            cmd3(0x22, 0, 63); // SSD1306_PAGEADDR
            cmd1(0xa0 | 0x1); // SSD1306_SEGREMAP
            cmd1(0xc8); // SSD1306_COMSCANDEC
            cmd2(0xda, 0x12); // SSD1306_SETCOMPINS
            cmd2(0x81, 0xcf); // SSD1306_SETCONTRAST
            cmd2(0xd9, 0xf1); // SSD1306_SETPRECHARGE
            cmd2(0xdb, 0x40); // SSD1306_SETVCOMDETECT
            cmd1(0xa6); // SSD1306_NORMALDISPLAY
            cmd2(0xd6, 1); // zoom on
            cmd1(0xaf); // SSD1306_DISPLAYON
            clear();
            _ZOOM = 1;
        }
    }


}
