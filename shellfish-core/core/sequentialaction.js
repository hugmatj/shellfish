/*******************************************************************************
This file is part of the Shellfish UI toolkit.
Copyright (c) 2023 Martin Grimme <martin.grimme@gmail.com>

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

shRequire([__dirname + "/action.js"], act =>
{

    const d = new WeakMap();

    /**
     * Class representing a sequential action.
     * 
     * The sequential action runs its child actions consecutively.
     * 
     * @memberof core
     * @extends core.Action
     * 
     * @property {bool} repeat - (default: `false`) While `true`, the sequence of action is repeated over and over.
     */
    class SequentialAction extends act.Action
    {
        constructor()
        {
            super();
            d.set(this, {
                actions: [],
                repeat: false
            });

            this.notifyable("repeat");
        }

        get repeat() { return d.get(this).repeat; }
        set repeat(r)
        {
            d.get(this).repeat = r;
            this.repeatChanged();
        }

        start()
        {
            this.wait(0).then(async () =>
            {
                while (d.get(this).repeat && this.enabled)
                {
                    const actions = d.get(this).actions.slice();
                    for (let i = 0; i < actions.length && this.enabled; ++i)
                    {
                        const action = actions[i];
                        await action.start();
                    }
                }
                this.finish();
            });

            return super.start();
        }

        add(child)
        {
            if (child._sh_action)
            {
                child.parent = this;
                d.get(this).actions.push(child);
            }
            else
            {
                console.error("Only actions may be added to a SequentialAction.");
            }
        }
    }
    exports.SequentialAction = SequentialAction;

});