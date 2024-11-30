/**
 * makecode I2C OLED 128x64 Package.
 * From microbit/micropython Chinese community.
 * http://www.micropython.org.cn
 */

//% weight=20 color=#0855AA icon="O" block="OLED12864_I2C"
namespace OLED12864_I2C {
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
    //% weight=70 blockGap=8
    //% parts=OLED12864_I2C trackArgs=0
    export function pixel(x: number, y: number, color: number = 1) {
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
    //% weight=80 blockGap=8
    //% parts=OLED12864_I2C trackArgs=0
    export function showString(
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
    //% weight=80 blockGap=8
    //% parts=OLED12864_I2C trackArgs=0
    export function showNumber(
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
    //% weight=71 blockGap=8
    //% parts=OLED12864_I2C trackArgs=0
    export function hline(x: number, y: number, len: number, color: number = 1) {
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
    //% weight=72 blockGap=8
    //% parts=OLED12864_I2C trackArgs=0
    export function vline(x: number, y: number, len: number, color: number = 1) {
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
    //% weight=73 blockGap=8
    //% parts=OLED12864_I2C trackArgs=0
    export function rect(
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
    //% weight=65 blockGap=8
    //% parts=OLED12864_I2C trackArgs=0
    export function invert(d: boolean = true) {
        let n = d ? 0xa7 : 0xa6;
        cmd1(n);
    }

    /**
     * draw / redraw screen
     */
    //% blockId="OLED12864_I2C_DRAW" block="draw"
    //% weight=64 blockGap=8
    //% parts=OLED12864_I2C trackArgs=0
    export function draw() {
        set_pos();
        pins.i2cWriteBuffer(_I2CAddr, _screen);
    }

    /**
     * clear screen
     */
    //% blockId="OLED12864_I2C_CLEAR" block="clear"
    //% weight=63 blockGap=8
    //% parts=OLED12864_I2C trackArgs=0
    export function clear() {
        _screen.fill(0);
        _screen[0] = 0x40;
        draw();
    }

    /**
     * turn on screen
     */
    //% blockId="OLED12864_I2C_ON" block="turn on"
    //% weight=62 blockGap=8
    //% parts=OLED12864_I2C trackArgs=0
    export function on() {
        cmd1(0xaf);
    }

    /**
     * turn off screen
     */
    //% blockId="OLED12864_I2C_OFF" block="turn off"
    //% weight=61 blockGap=8
    //% parts=OLED12864_I2C trackArgs=0
    export function off() {
        cmd1(0xae);
    }

    /**
     * zoom mode
     * @param d true zoom / false normal, eg: true
     */
    //% blockId="OLED12864_I2C_ZOOM" block="zoom %d"
    //% weight=60 blockGap=8
    //% parts=OLED12864_I2C trackArgs=0
    export function zoom(d: boolean = true) {
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
    //% weight=70 blockGap=8
    //% parts=OLED12864_I2C trackArgs=0
    export function outlinedCircle(x: number, y: number, r: number, color: number = 1) {
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
    //% parts=OLED12864_I2C trackArgs=0
    export function filledCircle(x: number, y: number, r: number, color: number = 1) {
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
    //% weight=100 blockGap=8
    //% parts=OLED12864_I2C trackArgs=0
    export function init(addr: number) {
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

}