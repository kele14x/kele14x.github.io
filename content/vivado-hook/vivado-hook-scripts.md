---
title: Vivado Pre-hook Script
date: 2014-07-04
---

把 Vivado 升级到了 2014.2，升级之后打开原来的工程文件编译部署没有问题，不过生成 bitstream 文件时有报错：

> [Drc 23-20] Rule violation (LUTLP-1) Combinatorial Loop - 255 LUT cells form a combinatorial loop. This can create a race condition. Timing analysis may not be accurate. The preferred resolution is to modify the design to remove combinatorial logic loops. To allow bitstream creation for designs with combinatorial logic loops (not recommended), use this command: set_property SEVERITY {Warning} [get_drc_checks LUTLP-1]. NOTE: When using the Vivado Runs infrastructure (e.g. launch_runs Tcl command), add this command to a .tcl file and add that file as a pre-hook for write_bitstream step for the implementation run.

没错，我是写 LUT 循环了，用来做个脉冲发生器。之前的版本默认是允许，只会给 Warning，现在却报错终止了。先不吐槽为何在最后一步生成时才给报错，来看看怎么搞定它。嗯，NOTE 有说明，不过还是有些不清楚，"as a pre-hook" 到底是个什么玩意儿？

好吧，就在项目设置里：

![vivado settings](./vivado-tcl-pre.png)

`tcl.pre`，就是这玩意儿了。对于我的问题，新建一个.tcl文件，随便放在哪儿，写入：

``` tcl
set_property SEVERITY {Warning} [get_drc_checks LUTLP-1]
```

然后在上图的设置内指定tcl.pre到这个文件就行了。注意设置里有几项 `tcl.pre`，是编译的不同时期执行的文件，这里的设置的是 `write_bitsream` 之前。
