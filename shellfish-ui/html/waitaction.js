/*******************************************************************************
This file is part of the Shellfish UI toolkit.
Copyright (c) 2021 Martin Grimme <martin.grimme@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*******************************************************************************/

"use strict";

shRequire(["shellfish/low", __dirname + "/animation.js"], function (low, anim)
{
    const d = new WeakMap();

    /**
     * Class representation a conditional wait action in an animation.
     * 
     * The WaitAction halts the animation until the passing condition is
     * fulfilled.
     * 
     * @memberof html
     * @extends html.Animation
     * 
     * @property {bool} pass - (default: `false`) The passing condition.
     */
    class WaitAction extends anim.Animation
    {
        constructor()
        {
            super();
            d.set(this, {
                pass: false
            });

            this.notifyable("pass");

            this.onBegin = () =>
            {
                if (d.get(this).pass)
                {
                    const handle = low.addFrameHandler(() =>
                    {
                        handle.cancel();
                        this.finish();
                    });
                }
            };
        }

        get pass() { return d.get(this).pass; }
        set pass(v)
        {
            d.get(this).pass = v;
            this.passChanged();

            if (v && this.busy)
            {
                this.finish();
            }
        }
    }
    exports.WaitAction = WaitAction;
});
