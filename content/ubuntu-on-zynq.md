---
title: "Ubuntu Running on ZYNQ"
date: 2020-05-12T11:46:06+08:00
categories: [FPGA]
tags: [ZYNQ, Ubuntu, RootFS]
---

In my previous post [ZYNQ Easy Startup Guide, Part II](/posts/zynq-easy-startup-guide-1/). We are have build a Linux image and run it on Pynq-Z2, using PetaLinux. There are different ways to get your Linux on Zynq running. Remember what components we need for a Zynq Linux system in [ZYNQ Hard Startup Guide](/posts/zynq-hard-startup-guide/)? PetaLinux generated image can be a good start point for us to start to replacing each components. This time we will try to run a Ubuntu RootFS on Zynq.

## Basic Design

Before this, assume you have had configurated your Linux kernel to select second partition of SD as RootFS, and finished building. To do this, run `petalinx-config`, and:

* In **Image Packaging Configuration > Root filesystem type**, select **EXT (SD/eMMC/QSPI/SATA/USB)**
* In same page **Device node of SD device**, set to **/dev/mmcblk0p2**

To verify the configuration, see **DTG settings > Kernel Bootargs > Auto generated bootargs (NO EDIT!)**, should be something like **console=ttyPS0,115200 earlycon root=/dev/mmcblk0p2 rw rootwait**.

## Setup SD Card

Assume SD boot, and the SD is split into two partitions. The first partition is boot partition (with label **BOOT**). This partition should be formatted as vfat. Put *BOOT.BIN* and *uImage* to this partition. Usually this partition is located at first few MBs (say, 50 MB) of SD card. The second partition with lable **rootfs**, and formatted as **EXT4** type. Usually occupy the left space of SD. We will copy the Ubuntu RootFS here. If SD card is not proper formatted, you can follow these steps:

1. Erase the partition table on SD card (this will clear **ALL** content on SD)

    ```bash
    sudo dd if=/dev/zero of=/dev/mmcblk0 bs=1M count=50
    ```

2. Create the partition layout:

    ```bash
    sudo sfdisk /dev/mmcblk0 <<-__EOF__
    1M,48M,0xE,*
    ,,,-
    __EOF__
    ```

    You can use other partition tool such as `fdisk`

3. Format partitions:

    ```bash
    sudo mkfs.vfat -F 16 -n BOOT /dev/mmcblk0p1
    sudo mkfs.ext4 -L rootfs /dev/mmcblk0p2
    ```

Note this should be a "best practice" of SD arrangement way, but not a must. As long as FSBL is up, every other components can be changed to any other location.

## Get Ubuntu RootFS

We will use debian's *debootstrap* tool to setup the RootFS. This tool can bootstrap a basic Debian (or Debian like, say, Ubuntu) system. This is just like the [official guide on Installing Ubuntu from a Unix/Linux System](https://help.ubuntu.com/lts/installation-guide/armhf/apds04.html).

### Install **debootstrap** and needed things

 ```bash
 sudo apt install debootstrap qemu-user-static
 ```

Why `qemu-user-static` is needed will be explain later.

### First stage **debootstrap**.

The basic syntax of this tool is `debootstrap [OPTION...] SUITE TARGET [MIRROR [SCRIPT]]`:

```bash
sudo debootstrap --foreign --arch=armhf bionic armhf_bionic_rootfs/ http://mirrors.huaweicloud.com/repository/ubuntu-ports/
```

To explain the option and arguments:

* We need `sudo`, since many files have same privilege with the real system -- owned by root
* We select `bionic` (codename of Ubuntu 18.04 LTS) as distribution. By replacing it with other Ubuntu/Debian codename, we can choose other distribution
* `--armch=armhf` to tell the tool to use **armhf** architecture, this is architecture name for Zynq (Cortex-A9 with NEON)
* `--foreign` to tell the tool not unpackage and install the downloaded packages, since we can't execute arm executables at x86 PC. An script `/debootstrap/debootstrap` will be added to the download folder
* An Ubuntu-ports mirror near your location should be use since it takes time to download from Internet

Wait the process finish downloading. The folder *armhf\_bionic\_rootfs* contains the basic RootFS, but is not ready to use.

### Second stage **debootstrap**

Usually we need to *chroot* into the RootFS and setup something, such as configuration the login, network, and install additional packages. Also, debootstrap need second stage work. The problem is the executable files **debootstreap** downloaded are for arm:

```bash
$ file armhf_bionic_rootfs/bin/bash
armhf_bionic_rootfs/bin/bash: ELF 32-bit LSB shared object, ARM, EABI5 version 1 (SYSV), dynamically linked, interpreter /lib/ld-, BuildID[sha1]=6a47f85147183bc5a7636eda9d9392ab269cde9c, for GNU/Linux 3.2.0, stripped
```

We can't run arm executable on x86 PC directly, so we need emulation. Thanks to QEMU, chroot to arm RootFS is simple:

```bash
sudo cp /usr/bin/qemu-arm-static armhf_bionic_rootfs/usr/bin/
```

After this, we can *chroot* into the download RootFS (QEMU is auto detected, the magic is explained [here](https://wiki.ubuntu.com/ARM/RootfsFromScratch/QemuDebootstrap)):

```bash
sudo chroot armhf_bionic_rootfs/
```

Then we need to finish the **debootstrap** process:

```bash
/debootstrap/debootstrap --second-stage
```

Packages are unpackaged and installed at this stage. It takes time. After finished, check the RootFS init is there:

```bash
# file /sbin/init
/sbin/init: symbolic link to /lib/systemd/systemd
```

You can see the systemd init is used, so this RootFS should boot. 

> I got some errors like `qemu: Unsupported syscall: xxx` when debootstap `focal` (Ubuntu 20.04 LTS). I'm still using Ubuntu 18.04 LTE, so I assume I can get rid of it if I upgrade my OS to 20.04.

## Configuration RootFS:

The next step is configurate the RootFS before we actually put it into real hardware. This is because the RootFS is still not ready for use on hardware, it will boot but not work correctly. What to configuration is quite personal, but few is recommend. Most of the below steps are in *chroot* environment:

### User & Password

If you want directly use **root**, unlock the root account and set a password for root:

```bash
passwd -u root
passwd
```

Ubuntu/Debian recommends not using root account, but we are on embedded platform that many things need root, so...

### Connect to network (/etc/resolv.conf)

Since the chroot environment is still using real PC. It should already connected to network (if host has network). Also **/etc/resolv.conf** should be proper configurated by **debootstrap**. But if not in some case, you can copy host's DNS configuration file to RootFS (out *chroot*):

```bash
sudo cp /etc/resolv.conf armhf_bionic_rootfs/etc/
```

### APT Mirror (/etc/apt/source.list)

Edit **/etc/apt/source.list** file so select an apt mirror near your location, for example, Huawei's mirror:

```bash
deb https://mirrors.huaweicloud.com/ubuntu-ports/ bionic main restricted universe multiverse
# deb-src https://mirrors.huaweicloud.com/ubuntu-ports/ bionic main restricted universe multiverse

deb https://mirrors.huaweicloud.com/ubuntu-ports/ bionic-security main restricted universe multiverse
# deb-src https://mirrors.huaweicloud.com/ubuntu-ports/ bionic-security main restricted universe multiverse

deb https://mirrors.huaweicloud.com/ubuntu-ports/ bionic-updates main restricted universe multiverse
# deb-src https://mirrors.huaweicloud.com/ubuntu-ports/ bionic-updates main restricted universe multiverse

deb https://mirrors.huaweicloud.com/ubuntu-ports/ bionic-backports main restricted universe multiverse
# deb-src https://mirrors.huaweicloud.com/ubuntu-ports/ bionic-backports main restricted universe multiverse

## Not recommended
# deb https://mirrors.huaweicloud.com/ubuntu-ports/ bionic-proposed main restricted universe multiverse
# deb-src https://mirrors.huaweicloud.com/ubuntu-ports/ bionic-proposed main restricted universe multiverse
```

### Install Additional Package

Some package is recommend, you can install in chroot:

```bash
apt install openssh-server
```

### Secure TTY (/etc/securetty)

The file **/etc/securetty** lists terminals from which root can log in. For Zynq the default serial port is usually */dev/ttyPSx* which is not list in this file for some reason. Append these lines:

```bash
# ZYNQ Console
ttyPS0
ttyPS1
```

If you are using PL UART, I guess you should add the device name to this file too.

### Filesystem Description File (/etc/fstab)

This file controls how system mount your SD card. But seems that even you don't write anything to this file, the **/dev/mmcblk0p2** is still mount at **/**.

```bash
# <spec>       <file>      <type> <mntops>           <dump> <check>
/dev/mmcblk0p2 /           auto   errors=remount-ro  0      1
/dev/mmcblk0p1 /boot/uboot auto   defaults           0      2
```

###  Hostname (/etc/hostname)

Hostname is your "computer name".

```
echo your-hostname > /etc/hostname
```

### Time and Time Zone

By default, NTP is running by a **systemd** service called `systemd-timesyncd`. You can set the time zone by:

```bash
timedatectl set-timezone Asia/Shanghai
```

The system time will be configurate by NTP when the board is connected to network.

### SSH Server

If you installed `openssh-server`, you can configurate it to allow **root** login. Edit **/etc/ssh/sshd_config**, find and edit the value `PermitRootLogin`:

```bash
PermitRootLogin yes
```

### Cleanup

Remove if QEMU file since it's not need for real hardware:

```bash
sudo rm /usr/bin/qemu-arm-static
```

Clean apt cache to free up some space:

```bash
apt clean
```

## Install Kernel and Root File System

Copy boot components to fist partition of SD card. The boot components are generated by `petalinux-build`:

```bash
cp BOOT.BIN /media/your-user-name/BOOT
cp image.ub /media/your-user-name/BOOT
```

Copy RootFS files to second partition of SD card:

```bash
sudo cp armhf_bionic_rootfs/* -a /media/your-user-name/rootfs
```

Copy with `sudo` and `-a` flag will take care of the file attributes (file permissions).

## Boot on Hardware

Eject SD card on PC, plug to board. Set your board's boot mode to SD, then power on. You may wan to ssh to your board and run a full `apt udpate & apt upgrade` to verify everything works fine.

## Reference

Remember refer to official Ubuntu doc before any other random internet post:

* https://help.ubuntu.com/lts/installation-guide/armhf/apds04.html

Some thing not explained clearly can be found on:

* https://www.digikey.com/eewiki/display/linuxonarm/Zynq-7000
* https://github.com/PyHDI/zynq-linux
* https://embeddedgreg.com/2017/06/02/creating-a-busybox-root-filesystem-for-zybo-zynq/
* https://blog.lazy-evaluation.net/posts/linux/debian-armhf-bootstrap.html
* https://blog.night-shade.org.uk/2013/12/building-a-pure-debian-armhf-rootfs/