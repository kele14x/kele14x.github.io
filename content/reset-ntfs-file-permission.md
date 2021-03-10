---
title: 重置 NTFS 文件的权限
date: 2017-10-23
categories: [Tool]
tags: [NTFS, Windows]
---

最近我把台式机的 Windows 10 LTSB 换成了 Windows 10 秋季更新。且不说 Windows 10 还是那么烂，我碰到了一个新的问题：由于是升级安装，原本躺在 C 盘里的一些文件还留着，但是它们的文件权限变得有点奇怪。让我们看看怎么修复它。

<!--more-->

![Permission Before](/image/reset-ntfs-file-permission-1.png)

注意到文件所有者一栏，是一个奇怪的字符串。它其实是我上一个 Windows 用户的 UID——当然已经随着 Windows 的更新而再也不存在了。于是 Windows 不认识这个人，才把它真身给显示出来。尽管我还可以正常打开它，但终究有些强迫症发作。

于是我开始思考，默认情况下，这个文件的权限应该是什么样子。好吧，这有点蠢，[其实 Windows 自带了权限修复工具](http://lallouslab.net/2009/06/14/resetting-ntfs-files-security-and-permission-in-windows-7/)。链接里那篇文章的作者还贴心的[写了一个 GUI 工具](http://lallouslab.net/2013/08/26/resetting-ntfs-files-permission-in-windows-graphical-utility/)，让它们用起来更傻瓜。工具名字就暴力的叫做“Reset files permission”。

作者也说了，它其实就是 Windows 自带的三个工具（icacls.exe, takeown.exe, attrib.exe）的包装，如果愿意可以自己手动调用。懒惰如我是不想这么干的。重置之后：

![Permission After](/image/reset-ntfs-file-permission-2.png)

注意到文件的所有者变成了当前用户，多余的权限条目也去掉了。真是神清气爽。当然别用这个工具重置 C 盘或者 Windows 系统文件夹的权限，会死的很难看。