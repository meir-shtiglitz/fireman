import React from 'react';
import "../css/rabbit.scss";

function Rabbit() {
    return (
        <div className='rabbit-wrap'>
            <div class="magic-trick">
                <div class="rabbit">
                    <div class="ears">
                        <div class="ear right"></div>
                        <div class="ear"></div>
                    </div>
                    <div class="head">
                        <div class="face">
                            <div class="eyes">
                                <div class="eye"></div>
                                <div class="eye"></div>
                            </div>
                            <div class="nose"></div>
                            <div class="mouth">X</div>
                        </div>
                    </div>
                    <div class="body">
                        <div class="paws">
                            <div class="paw"></div>
                            <div class="paw"></div>
                        </div>
                    </div>
                    <div class="feet">
                        <div class="foot-left"></div>
                        <div class="foot-right"></div>
                    </div>
                </div>
                <div class="hat">
                    <div class="hat-top"></div>
                    <div class="hat-body">
                        <div class="hat-border"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Rabbit