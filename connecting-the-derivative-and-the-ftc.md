# Connecting the derivative to the FTC

If you map the slope of a function at every point, you get the derivative. That is given.

The connection lab does the reverse in pictures. It takes that derivative graph, cuts it into Riemann slices of width \(dx\), and adds those slices from a starting input \(a\). Each slice is a little change in height. Stacked together they should rebuild the original function.

\[
f(a) + \sum f'(x_i)\,dx \;\longrightarrow\; f(x) \quad\text{as}\quad dx \to 0.
\]

## What to watch

Open **Connecting them**.

- **Right graph:** \(f'\), with yellow Riemann rectangles. This is the FTC simulation, but the function being sliced is the slope graph.
- **Left graph:** original \(f\) in blue, and the running Riemann total in gold. At a coarse \(dx\) the gold path is a staircase that only roughly follows \(f\). The readout under the graphs compares \(f(b)\) to that running total.
- Slide \(dx\) to 0. The staircase tightens, then the two curves occupy the same line. The y-values have merged.

That merge is the FTC: accumulating the rate of change recovers the original change in \(y\).

## Why it has to work

A right Riemann slice of \(f'\) has area \(f'(x_i)\,dx\). For small \(dx\) that area is almost the rise \(f(x_i)-f(x_{i-1})\). Adding the rises from \(a\) to \(b\) is just \(f(b)-f(a)\). Sending \(dx\) to zero removes the “almost.”

So the derivative simulation (microscope on a point) and the FTC simulation (census of an interval) are inverses. Connecting them is watching the census of slopes put the original graph back together.

## A short run

1. Choose \(x^2\). The right graph is \(2x\). At large \(dx\) the gold reconstruction on the left lags or overshoots the parabola.
2. Shrink \(dx\). Watch \(f(b)\) and the Riemann total in the readout come together.
3. Repeat with \(\sin(x)\) (right graph \(\cos(x)\)) and \(e^x\) (right graph also \(e^x\)).
