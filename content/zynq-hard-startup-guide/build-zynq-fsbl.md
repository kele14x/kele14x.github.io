---
title: "Build ZYNQ FSBL"
date: 2020-02-29T14:46:52+08:00
categories: [FPGA]
tags: [ZYNQ, Linux, PetaLinux]
draft: True
---

Let's try build a boot image for ZYNQ, in a hard way. Part I will cover bare metal case.

<!-- more -->

## Build FSBL

For Zynq, the boot sequence is usually **BootROM -> FSBL -> User Application/U-Boot [-> Linux Kernel]**. FSBL is a components for ZYNQ software. It's a bare metal executable that *usually* used as first stage boot loader to boot user application or U-Boot. FSBL's source code is shipped along with Vitis/PetaLinux, and hosted on [Github](https://github.com/Xilinx/embeddedsw).

There are are three ways to build FSBL:

* **PetaLinux**: PetaLinux will automatically build FSBL when building other components like U-Boot and Linux kernel.
* **Vitis**: You can create a Vitis platform project and choose it build FSBL automatically. Or create a application project and choose FSBL template.
* **Build from source and Makefile**: The most straight way.

## PetaLinux

### Build ELF

After you create a PetaLinux project and run `petalinux-build`, or `petalinux-build -c fsbl`. The tool will fetch FSBL source and build it for you. After build process, the *.elf* will lie in `<petalinx-project-dir>/images/linux` folder. 

### Customization

