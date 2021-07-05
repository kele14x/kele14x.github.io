---
title: Write OOC DCP in Vivado
---

Out-of-context (OOC) is hierarchical design flow described in [UG905 Vivado Design Suite User Guide: Hierarchical Design][UG905]. It enables the ability of doing synthesize and implementation on module independent of rest of the design. So you can do analysis the module earlier and quick. The OOC synthesis or implementation result can be saved as a design checkpoint (DCP) file. The DCP file then delivered to top level as a component, so the design and constraints could be reused.

## Out-of-Context Synthesis

Even OOC synthesis or OOC implementation result could be used. Synthesis result is more suitable, since it keeps net list but left ability for top module to do optimization and physical placement. To perform a OOC synthesis on specified module:

1. Set the target module as top.

2. In synthesis setting, add `-mode out_of_context` in the *More Options*

    ![Vivado OOC Synthesis](vivado-ooc-synth.png)

3. Usually OOC module will not (and should not) contains BUFG. If you want to ensure it, you can set `-bug` to `0`. However, if your module synthesized unwanted BUFG, I recommend you check your design instead of force this parameter.

4. Do synthesis. After it done, you can analyze your design's timing, CDC, etc.

    Equivalent TCL command for step 1 ~ 4 is: `synth_design -top <top-name> -mode out_of_context -bufg 0`

5. If you want to export DCP file. Click **Open Synthesis Design**, then use **File -> Checkpoint -> Write...**. Or use TCL command: `write_checkpoint`

## Out-of-Context Constraints

Optionally, you can add constraint for OOC design. The constraints will help you synthesize your design, and maybe shipped with exported DCP. When export the OOC result to DCP file, the constraint will be packaged into it for top module reusing.

Recommended minimal constraints are:

```tcl
create_clock -period <clock_period_in_ns> -name <clock_name> [get_ports <clock_port_name>]

set_property HD.CLK_SRC BUFGCTRL_X0Y16 [get_ports <clock_port_name>]
```

This two constraints will add clock information to OOC module. Tool will try to meet the timing requirement during synthesizing. After synthesis, you can analyze timing with valid clock definition. Constraints you defined for OOC will goes with DCP and will be shipped to top module.

However, some constraints are need during OOC synthesis, but you don't want them goes to top with DCP. For example, if your top module already defined a clock, which will connect to the DCP. Clock define in DCP will conflict with it and result a warning. Depend on the constraints reading sequence, it may override top module definition and result fatal error. In this situation, you can move those constraints to separated file, and set the `USED_IN` property of the file:

![Vivado OOC Constraints](vivado-ooc-used-in.png)

... or use the tcl script:

```tcl
add_files <file>.xdc
set_property USED_IN {synthesis implementation out_of_context} [get_files <file>]
```

## Reference

- [UG903 Vivado Design Suite User Guide: Using Constraints][UG903]
- [UG905 Vivado Design Suite User Guide: Hierarchical Design][UG905]

[UG903]: https://www.xilinx.com/support/documentation/sw_manuals/xilinx2021_1/ug903-vivado-using-constraints.pdf
[UG905]: https://www.xilinx.com/support/documentation/sw_manuals/xilinx2021_1/ug905-vivado-hierarchical-design.pdf
