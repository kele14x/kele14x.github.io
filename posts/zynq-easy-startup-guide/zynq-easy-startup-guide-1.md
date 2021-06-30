# ZYNQ Easy Startup Guide, Part I

Xilinx release Vitis tool last year, replaces it's old Xilinx SDK. There is few documents for it, and I'm planning to switch to it from SDK. Let's try start from sketch so that we can study some basic concepts. **Part I** will including a simple PL design and a simple single core bare metal PS program, from project to boot on board.

## Required Things

### Software Tools

From 2019.2, for bare metal, Xilinx provides 2 tools for ZYNQ chips:

* [Vivado (design suit)](https://www.xilinx.com/support/download/index.html/content/xilinx/en/downloadNav/vivado-design-tools.html), including *Vivado*, *Vivado HLS*, *System Generator* and *Model Composer*s. These tools are mainly for PL (FPGA part in ZYNQ) development.
* [Vitis IDE](https://www.xilinx.com/support/download/index.html/content/xilinx/en/downloadNav/vitis.html). It's for PS side development. Also AI Engine and accelerate application is done in Vitis.

Download and install Vitis IDE, since the installer includes Vivado. Full tool installation is recommend even you does not have license from some tool. But only install required device family to reduce size. Installing is quite straight forward, just run the installer and follow the wizard.

### Development Board

My dev board is PYNQ-Z2. It's much cheap than famous [ZedBoard](http://zedboard.org/product/zedboard) but with essential peripherals. Bare board package without power adaptor/SD card/cables is enough. For more information:

* http://www.pynq.io/board.html
* http://www.tul.com.tw/ProductsPYNQ-Z2.html

However, we won't use PYNQ's pre-build image.

### Test JTAG and UART Connection

PYNQ-Z2 only require one USB cable connection with PC. This cable is used for both power, JTAG and UART connection. If more power is required, dedicated power cable can be used. Connect the cable and open **Vivado -> Open Hardware Manager** to test JTAG connection.

* UART and JTAG connection is done via **FTDI FT2232HL** USB-UART & USB-JTAG bridge chip. The driver should be installed automatically for windows 10 and Ubuntu, so no driver installation is need. If need to install the driver manually, refer to [FT2232H's product page](https://www.ftdichip.com/Products/ICs/FT2232H.html).
* Remember the COM port number for UART connection. For windows, it should be COMx. For linux, the name should be /dev/ttyUSBx.

## Step1. PL (Platform) Design

PL side design including:

* One block design which contains **ZYNQ processing system** IP.
* Other logic design, including RTL, IP, Block Design.

ZYNQ's PS does not require PL side running, however PS side design needs some initial files, which need to be generated from Vivado (You do not want to initial every register in *main.c*). Let's start a simplest project.

### Step 1.1 Create Vivado Project

1. Download PYNQ-Z2 board file [TUL](http://www.tul.com.tw/ProductsPYNQ-Z2.html). These files including board information and presets for PYNQ-Z2. Also many documents for this board is on this page.
2. **Unzip** the board file to **C:\\Xilinx\\Vivado\\2019.2\\data\\boards\\board_files\\**. After install these files, you can select pynq-z2 from Vivado's board select menu.
3. Start Vivado, create a project, selecting part **pynq-z2 (xc7z020clg400-1)**.

### Step 1.2 Block Design

1. In Vivado project, create a block design.
2. Add IP **ZYNQ7 Processing System** (PS7) to block design.
3. Click *Run Block Automation* from menu, this will load many preset parameters (most importantly, DDR parameters) for PS7 IP from board file.
4. Connect `FCLK_CLK0` to `M_AXI_GP0_ACLK` for PS7 IP. This clocks GP0 port using FCLK, or the GP0 port will not work, and let us pass DRC check.
5. Create a HDL wrapper for block design, Since Vivado requires a HDL file/module as top.
6. Do synthesis, implementation, and generate bitstream. There will be many warnings, review and ignore them.
7. Export *.xsa* file from menu ** File -> Export -> Export Hardware...**

### About .xsa File

**.xsa** file replace old **.hdf** file as hardware export result. But as the same, you can rename the file to **.zip** and unzip it. There are many interesting files in the zip. You can view them.

## Step 2. Platform and Domain (BSP) Design

Xilinx are developing more complex heterogeneous chip (mixing different type of chips together). There are more number and types of processer in Xilinx's new chips. For ZYNQ7 series, there are only three: 2 Cortex-A7 processer and one FPGA. For new chips, there may be AI Engine (Math Engine), Cortex-A53, Cortex-R5, FPGA and RF SoC. Things are becoming complex, so does software development. There are 4 concepts for Vitis IDE: *Platform*, *Domain*, *System* and *Application*, replace the *Platform*, *BSP* and *Application* in SDK. Let's care about *platform* and *domain* firstly. In fact, they are BSPs in SDK.

* **Platform Project**: Platform project are generated from **.xsa** file. I think platform project should represents one chip and FPGA design in this chip. (Sorry I does not have experience on AI engine and RF SoC chip). On platform project holds one or more *domains*.
* **Domain**: Domain replace the old **BSP project** in SDK. One domain represents one OS/application. It serves as library support package for application or OS. One domain can span one or more isomorphic processers.

For our case, we have one platform, which will be generated from the .xsa file we got on first step. We will have on domain named **bare metal domain on cortexa9_0**. We will leave cortexa9_1 unused.

If we want to run two bare metal application on two Cortex-A9. We will need two domains. Second domain should be named **bare metal domain on cortexa9_1**.

If we want to run one Linux on both Cortex-A9. We will need only one domain, named **Linux domain on cortexa9**.

### Step 2.1. Create Platform Project

1. Copy the **.xsa** file to somewhere.
2. Launch Vitis IDE. Create a new Platform Project. Selecting the **.xsa** file.
3. Select **standalone** and **ps7_cortexa9_0**, finish the wizard.
4. Build the platform project.

### Step 2.2. Review the Domain in Platform

Double click the **.spr** file. Two domains are automatically add by the wizard:

* **zynq_fsbl** domain. The domain's type is *standalone*. Which is used for **FSBL** application. Also the **FSBL** application project with source code is added and build.
* **standalone on ps7_cortexa9_0**. The type is also *standalone*. This is for your further application.

## Step 3. System and Application Design

After we get FSBL and BSP. Next step is create our simple "Hello World" application. There are two types of projects here:

* **System Project**: An system project is an container for multiple applications that would run on different domains of a platform at same time. You can't create system project directly. They are created alone with application project.
* **Application Project**: An application, could be bare metal, RTOS, or Linux application.

For our case, we need one system project which holds our  "Hello World" application.

### Step 3.1. Hello World Application 

1. In Vitis IDE, create a new application project.
2. In wizard, create a new system project for this application project.
3. Choose *Empty Application* Template. This template including a makefile and a linker script.
4. Create an file called **main.c**. Add those content:
   ```c
   #include <stdio.h>
   #include "sleep.h"
   
   int main () {
   	int i = 0;
   	while(1) {
   		printf("Hello World %d\n", i);
   		i++;
   		sleep(1);
   	}
   	return 0;
   }
   ```
5. Build the application project.

### Step 3.2. Run the Application via JTAG

We can directly run the application on board, with the help of Vitis.

1. Open **Run -> Run Configuration...**
2. Right click **Single Application Debug**, create **New Configuration**
3. Run the new run configuration.
4. On Vitis's console window. Create a **Command Shell Console**.
5. Connection type is **Serial Port**, parameters are 115200,8,n,1.
6. PYNQ-Z2 should printing "Hello World" every 1 second in console.

## Step 4. Boot the Application

We want to boot the application on board without the help of JTAG. Before this we need to know the boot sequence of ZYNQ. In general, the boot sequence is:

1. Chip is power on.
2. CortexA9_0 will start from RAM address 0. It's BootROM, which is factory preloaded and can't be changed.
3. BootROM will sample the boot pins. And try to load the *boot image* on boot device, and give the control of processer to *boot image*.
4. The first part of *boot image* is usually **FSBL**. FSBL is *first stage boot loader**, which is an user application, but Xilinx has provides source code for it. At most cases, we does not need to modify it.
5. **FSBL** will program the FPGA bitstream. And load real user application.
6. User application take charge of CortexA9_0. If need, user application can starts up CortexA9_1.

### Step 4.1. Build the Boot Image

In Vitis IDE, the boot image is automatically created under system project. It's under *\<system project\>/Debug/sd_card/BOOT.BIN*. It's called "SD Card" but any boot device can use it. For example, QSPI flash. If you want to build the Boot Image manually, you need a **.bif** file, which the template can be got from *\<system project>/Debug/system.bif*.

### Step 4.2. Program the Flash (Or SD Card)

1. For QSPI boot, you program the **BOOT.BIN** file to beginning of Flash. You can program the flash in Vitis' **Xilinx -> Program Flash** menu.
2. For SD boot, copy the **BOOT.BIN** file to the first patriation of SD card.
3. Power off the board. Change the boot pins to the boot device you want.
4. Close the hardware server in Vivado and Vitis. In case the JTAG stops the processer.
5. Power on the board.
6. Connect the UART using parameter 115200,8,n,1.
7. You should see the "Hello World" printing on console. Which means the application starts up correctly.

## What Happened

We just finish the bare metal ZYNQ application design flow, including both PL and PS side. We have create the FPGA design and export the **.xsa** file for software design. We create an simple bare metal application based on the FPGA design and successfully boot it on board. Even it's only on first processer of dual Cortex-A9, the second processer is in idle. It's still need extra works to make two processers work together, which is not covered by this article.

## What's Next

In Part II. We will try to build and start Linux on ZYNQ.
