---
title: "SystemVerilog Variable and Net"
date: 2020-12-29T13:21:19+08:00
---

## Verilog

During school, my EDA teacher told me to use `wire` and `reg` in my Verilog design. And for a very long time, I have the feeling the `wire` is for model a logic connection and `reg` is for register. But that's very wrong.

The [Verilog HDL LRM](https://ieeexplore.ieee.org/document/1620780) has defined many data types, and group them into two main groups: the *net* data types and *variable* data types. `wire` is most (and almost all) used *net* type, and `reg` is most used *variable* type. LRM difference the *net* data types and *variable* data type with if it can store a value. *variable* can, but *net* can't. So the value of *net* must be depended on other *variable*.

So it's seems natural to map `wire` with combination logic, and `reg` with real registers in hardware. It's true that `wire` will model combination logic, but it's no true for `reg`. In fact, depends on your Verilog code, `reg` can become combination logic, registers, or even latch.

Consider that the name `reg` is very easy for people to associate it with register in real hardware. They choose a poor name.

## SystemVerilog

When things comes to SystemVerilog, seems they want to fix this problem. So the [SV-LRM](https://ieeexplore.ieee.org/document/8299595) makes a distinction between data object and its data type.

> **data object**: A named entity that has a data value associated with it. Examples of data objects are nets,
variables, and parameters. A data object has a data type that determines which values the data object can
have.
>
> **data type**: A set of values and a set of operations that can be performed on those values. Examples of data
    types are logic, real, and string. Data types can be used to declare data objects or to define user-defined
    data types that are constructed from other data types.

### Nets

To declare a net, you use the (simplified) syntax:

```plain
<net_type> <data_type> <net_identifier>;
```

And, `wire` is one built-in net type. For example:

```systemverilog
wire logic w;
```

SystemVerilog has many built-in data type. And the most used is `logic`. So above code will declare a data object named `w`, it a *net* with net type `wire` and data type `logic`.

### Variables

To declare a variable, you use the (simplified) syntax:

```plain
var <data_type> <variable_identifier>;
```

An new keyword `var` is here to explicit declare a variable. For example:

```systemverilog
var logic v; // same as var reg v;
```

will declare a data object name `v`, it's *variable* with data type `logic`. *variable* does not have such a thing called variable type.

Like verilog, *variable* can be combination logic, registers, or even latch.

What about `reg`? In-fact, `reg` and `logic` is same thing. `reg` is till there for backward compatible with Verilog. But it's not recommended for new design, since the name is confusable.

### Implicit Rules

Util now, things are quite straightforward. If `wire` is there, you know it's a net. If you see `var`, it's a variable. They all have data type such as `logic`, `reg`. The difference between *net* and *variable* is that *net* does not store a value.

But things goes confusion when you still see `wire a` and `reg b` in SystemVerilog file... This is may because many designers are come from Verilog, and `var` or `logic` can be omitted for compatible with Verilog.

So what is `wire a` and `reg b` in SystemVerilog? From LRM, `wire a` is net declaration with implicit data type `logic`. So `wire a` is equivalent to `wire logic a`.

For `reg b` it's not that simple. `reg r` is equivalent to `var logic r` for data object inside module. For port, a port can be net or variable, and default is net. So `reg b` is equivalent to `wire logic b` for port declaration.

### Example

This is a simple example:

```systemverilog
module variables_and_nets(only_input);

// Net

    input only_input;

    wire only_wire;

    wire logic wire_logic;

    // This is specially not allowed, since Verilog developer will be unhappy
    // wire reg wire_reg;

// Variable

    var only_var;

    reg only_reg;

    logic only_logic;

    var reg var_reg;

    var logic var_logic;

endmodule
```

### Recommendations

My recommendations are:

1. For port declaration, use explicit `var`. This makes your port have be a variable. And multi-driven is not allowed for variable, so you can easy see issue during design.

2. Use `logic` mainly. So you will default get a variable, so you can detect multi-drive.

3. Do not use `reg`. It's a poor name and replaced by `logic`.

4. If you really want net, use `wire`.

5. Set `default_nettype` directive to `none` for all source file. It will require you explicit write `wire` when you want net. Also it will prevent you from accidentally declare a new net when you have a typo. (If not, synthesis tool usually will give a warning, but quite unremarkable).
