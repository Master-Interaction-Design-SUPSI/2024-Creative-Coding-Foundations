/*
Author: Marco Lurati, https://github.com/marclura
Reference: https://developer.chrome.com/docs/capabilities/serial
*/

const support_status = document.getElementById('support_status');
const main = document.getElementsByTagName("main");

// check if the browser supports the WebSerial API
if('serial' in navigator) {
    //support_status.innerHTML = "The browser supports the WebSerial API";
    support_status.remove();

    let button_start_serial = document.getElementById('button_start_serial');
    let button_stop_serial = document.getElementById('button_stop_serial');

    let readingLoop = true;
    let device_connected = false;

    button_start_serial.addEventListener('click', async() => {

        readingLoop = true; // start reading

        // connect the serial port

        // Prompt user to select any serial port
        let port = '';
        await navigator.serial.requestPort().then((p) => {
            port = p;
            let port_selected_message = 'Port selected: usbProductId: ' + port.getInfo().usbProductId + ', usbVendorId: ' + port.getInfo().usbVendorId;
            device_connected = true;
            addSerialLoggerLine(port_selected_message);
            console.log(port_selected_message);
        })
        .catch((error) => {
            //addSerialLoggerLine(error);
            addSerialLoggerLine("Cancel. If the device is not visible try to reconnect it");
            //console.log(error);
        });
        
        navigator.serial.ondisconnect = () => {
            addSerialLoggerLine("Device disconnected!");
            console.log("Device disconnected!");
            serialDisconnect();
        };

        navigator.serial.onconnect = () => {
            addSerialLoggerLine("Device connected!");
            console.log("Device connected!");
        };

        if(device_connected) {
            await port.open({ baudRate: 250000 }).then(() => {
                addSerialLoggerLine("Serial connection started!");
            })
            .catch((error) => {
                addSerialLoggerLine(error);
                console.log(error);
            })
        }

        while(port.readable) {
        
            /**
             * Read
             */

            button_start_serial.classList.add('hidden');
            button_stop_serial.classList.remove('hidden');

            const textDecoder = new TextDecoderStream();
            const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
            const reader = textDecoder.readable
                .pipeThrough(new TransformStream(new LineBreakTransformer()))
                .getReader();

            /**
             * Write
             */

            

            

            try {

                // Write
                /*
                const writer = port.writable.getWriter();
                const datas = new Uint8Array([1, 0]);
                let logger_line_write = document.createElement('div');
                logger_line_write.innerHTML = value;
                
                let logger_w = document.getElementById('data_logger_write');
                logger_w.prepend(logger_line);

                console.log(datas);

                await writer.write(datas);

                writer.releaseLock();
                */


                // Read

                while(readingLoop) {
                    const {value, done} = await reader.read();

                    if(done) {
                        reader.releaseLock();
                        break;
                    }

                    // uint8array (raw datas)
                    // console.log(value);

                    /*
                    let logger_line = document.createElement('div');
                    logger_line.innerHTML = value;
                    let logger = document.getElementById('data_logger_read');

                    logger.prepend(logger_line);

                    if(logger.childElementCount > 10000) {   // limit the log lines to avoid browser crashing
                        logger.removeChild(logger.lastChild);
                    }
                    */

                    const serialDataSplit = value.split(',');

                    updateWebPage(serialDataSplit);     // function to call for getting the values
                    //console.log(serialDataSplit);
                }

                reader.cancel();
                await readableStreamClosed.catch(() => {
                    // ignore this error
                });

                /*
                writer.close();
                await writableStreamClosed.catch(() => {
                    // ignore this error
                });
                */

                await port.close();
            }
            catch (error) {
                addSerialLoggerLine(error);
                console.log(error);
            }
        }
    })

    button_stop_serial.addEventListener('click', async() => {
        serialDisconnect();
    })

    function serialDisconnect() {
        addSerialLoggerLine("Serial connection stopped!");
        button_start_serial.classList.remove('hidden');
        button_stop_serial.classList.add('hidden');
        device_connected = false;
        readingLoop = false;
    }

    function addSerialLoggerLine(value) {
        const date = new Date();
        const hour = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const sec = String(date.getSeconds()).padStart(2, '0');

        let serial_logging_line = document.createElement('div');
        serial_logging_line.innerHTML = hour + ":" + min + ":" + sec + " - " + value;
        document.getElementById('serial_logger_container').prepend(serial_logging_line);
    }

}
else {
    support_status.innerHTML = "The browser doesn't support the WebSerial API. Please use Brave or Chrome browsers.";
    document.getElementById("serial_control_bar").remove();
    main[0].remove();
}

// split incoming datas at line break
class LineBreakTransformer {
    constructor() {
        this.chunks = '';
    }

    transform(chunks, controller) {
        this.chunks += chunks;
        const lines = this.chunks.split("\r\n");
        this.chunks = lines.pop();
        lines.forEach((line) => controller.enqueue(line));
    }

    flush(controller) {
        controller.enqueue(this.chunks);
    }
}