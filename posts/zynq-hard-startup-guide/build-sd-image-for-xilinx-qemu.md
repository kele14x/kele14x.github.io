---
title: "Create SD Image for Xilinx Qemu"
date: 2020-05-16T18:43:22+08:00
categories: [FPGA]
tags: [ZYNQ, QEMU]
---

Along with PetaLinux, Xilinx provide a QEMU (Quick Emulator) for emulation Zynq/ZynqMP/MicroBlaze device on host PC. With QEMU, you can run Zynq programs, even a full Linux system without a real hardware. It's very easy to interactive with it `petalinux-boot --qemu`. But how if we want to boot from SD card?

<!--more-->

## Requirements

Assume a bootable image is created by `petalinux-build` or other tools. This including device tree, u-boot, kernel and RootFS. (FSBL, bitstream is not needed).

## Create SD Card Image

First we need a image file of the SD card. We will create the file **qemu_sd.img** from sketch:

```bash
dd if=/dev/zero of=qemu_sd.img bs=512M count=1
```

If the image file size is too small to hold your RootFS, change `bs=512M` to something larger.

Next step is create partition of image, just like a real hard drive:

```bash
sudo sfdisk qemu_sd.img <<-__EOF__
1M,48M,0xE,*
,,,-
__EOF__
```

You can do it with other partition tool too.

## Format SD Image

After the partition table is ready, we need to format the two partitions. But this not as easy as format real SD card. It need some trick. The first step is to mount the file to *loop* device:

```bash
sudo losetup -f --show -P qemu_sd.img
```

The `-f --show` flags tells *losetup* to find first unused **/dev/loopx** device and show to user. The `-P` flag tells the tool to scan the partition table.

If no loop device is used, **loop0** will be use. Then two device **/dev/loop0p1** and **/dev/loop0p2** is created. So we can format them:

```bash
sudo mkfs.vfat -F 16 -n BOOT /dev/loop0p1
sudo mkfs.ext4 -L rootfs /dev/loop0p2
```

Create two folders for mount:

```bash
mkdir BOOT
mkdir rootfs
```

Mount the loop0px device:

```bash
sudo mount /dev/loop0p1 BOOT
sudo mount /dev/loop0p2 rootfs
```

## Install Kernel and RootFS

Copy Linux kernel and RootFS to SD image:

```bash
cp image.ub BOOT
sudo cp armhf_bionic_rootfs/* -a rootfs
```

Then unmount the device:

```bash
sudo umount BOOT
sudo umount rootfs
```

Delete the **loop0px** device:

```bash
sudo losetup -d /dev/loop0
```

## QEMU Boot to SD Image

```bash
petalinux-boot --qemu --u-boot --qemu-args "-drive file=qemu_sd.img,if=sd,format=raw"
```

If everything works, you can see QEMU console and the emulator is booting from u-boot. U-boot will load and boot Kernel from emulated SD device.