# Draw

Draw by pressing the mouse button and dragging. 

## Options

There are several variables which can be changed:
1. cursors
   The amount of cursors to draw with. The angle between the cursors is translated to the center and is `TWO_PI / cursors`
2. lineColor
   The drawing color.
3. fraction
   The deceleration of the lines. Higher fraction -> lower deceleration -> longer movement.
4. lineWidth
   The drawing width.
5. pointDistance
   A drawn line contains multiple points which are connected by lines. This variable regulates the maximum time to wait to create another point. Generally, the higher this variable, the edgier the drawing will be.
6. symmetry
   Turn mirroring towards the y-axis translated to the center on/off.
7. spiral
   Turn on/off spiraling towards the center of the canvas. If on, 3 additional points for each cursor (and each mirrored cursor) are created.
8. displayCursors
   Set visibility of cursors.

## Try out:

Try out the following:
1. set cursors to 100
2. set fraction to 0.999
3. have fun