/* 
 * Copyright (C) 2018 Qli5. All Rights Reserved.
 * 
 * @author qli5 <goodlq11[at](163|gmail).com>
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { SimpleEvent } from '../util/simple-event-target.js';
import { OnEventDuplexFactory } from '../util/event-duplex.js';

class BiliUserJS extends OnEventDuplexFactory<
    {},
    { videochange: SimpleEvent, videoloadstart: SimpleEvent, videoemptied: SimpleEvent, controlload: SimpleEvent, cidchange: SimpleEvent, aidchange: SimpleEvent, domcontentload: SimpleEvent, playerload: SimpleEvent },
    { onvideochange: SimpleEvent, onvideoloadstart: SimpleEvent, onvideoemptied: SimpleEvent, oncontrolload: SimpleEvent, oncidchange: SimpleEvent, onaidchange: SimpleEvent, ondomcontentload: SimpleEvent, onplayerload: SimpleEvent }
    >(['videochange', 'videoloadstart', 'videoemptied', 'controlload', 'cidchange', 'aidchange', 'domcontentload', 'playerload']) {
    readystate: 'disconnected' | 'domloading' | 'domcontentloaded' | 'playerloaded'
    playerWin: Window
    video: HTMLVideoElement | null
    cid: string | null
    aid: string | null

    constructor(playerWin = top) {
        super();
        this.readystate = 'disconnected';
        this.playerWin = playerWin;
        this.video = null;
        this.cid = null;
        this.aid = null;
    }

    /**
     * 
     * @param playerWin (default this.playerWin)
     */
    observe(playerWin?: Window) {
        /**
         * As of 2018-07, loading includes:
         * 1. <head> set window.__playinfo__
         * 2. <body>(sync) inject a dummy player(id="bofqi") with dom templete and video element
         * 3. DOMContentLoaded
         * 4. (async) initialize video controllers
         */
        if (playerWin) this.playerWin = playerWin;
        this.readystate = 'domloading';
    }

    observedomcontentload({ playerWin }: { playerWin: Window }) {
        if (playerWin.document.readyState == 'loading') {
            playerWin.document.addEventListener('DOMContentLoaded', () => {
                const document = playerWin.document;
                this.dispatchEvent({ type: 'domcontentload', document });
            }, { once: true });
        }
        else {
            const document = playerWin.document;
            this.dispatchEvent({ type: 'domcontentload', document });
        }
    }

    observeBofqiload({ document }: { document: Document }) {
        const bofqi = document.getElementById('bofqi');
        this.dispatchEvent({ type: 'bofqiload', bofqi });
    }

    observePlayerchange({ bofqi }: { bofqi: HTMLDivElement }) {
        const player = document.getElementById('bilibiliPlayer');
        if (player) {
            this.dispatchEvent({ type: 'playerchange', player });
        }
        const observer = new MutationObserver(() => {
            const player = document.getElementById('bilibiliPlayer');
            if (player) {
                this.dispatchEvent({ type: 'playerchange', player });
            }
        });
        observer.observe(bofqi, { childList: true });
    }

    observePlayerdomload({ player }: { player: HTMLDivElement }) {
        const container = player.getElementsByClassName('bilibili-player-video-control')[0];
        if (player) {
            this.dispatchEvent({ type: 'playerchange', player });
        }
        const observer = new MutationObserver(() => {
            const player = document.getElementById('bilibiliPlayer');
            if (player) {
                this.dispatchEvent({ type: 'playerchange', player });
            }
        });
        observer.observe(player, { childList: true });
    }

    observeMenuload() {
    }

    observeControlload({ player }: { player: HTMLDivElement }) {
        const container = player.getElementsByClassName('bilibili-player-video-control')[0];
        const controll = player.getElementsByClassName('bilibili-player-video-btn-start')[0];
        if (controll) {
            this.dispatchEvent({ type: 'controll', controll });
        }
        const observer = new MutationObserver(() => {
            const video = container.lastChild;
            if (video) {
                this.dispatchEvent({ type: 'videochange', video });
            }
        })
        observer.observe(container, { childList: true });
    }

    observeVideochange({ player }: { player: HTMLDivElement }) {
        const container = player.getElementsByClassName('bilibili-player-video')[0];
        const video = container.lastChild;
        if (video) {
            this.dispatchEvent({ type: 'videochange', video });
        }
        const observer = new MutationObserver(() => {
            const video = container.lastChild;
            if (video) {
                this.dispatchEvent({ type: 'videochange', video });
            }
        })
        observer.observe(container, { childList: true });
    }

    disconnect() {
    }

    async preventUnloadAwait<T>(promise: Promise<T>, onbeforeunload?: Function) {
        const listener = (e: BeforeUnloadEvent) => {
            if (onbeforeunload) onbeforeunload();
            return e.returnValue = true;
        }
        try {
            this.playerWin.addEventListener('beforeunload', listener);
            return await promise;
        }
        finally {
            this.playerWin.removeEventListener('beforeunload', listener);
        }
    }

    get videochangePromise() {
        return BiliUserJS.asyncOnce(this, 'videochange');
    }

    get videoloadstartPromise() {
        if (!this.video!.readyState) {
            return BiliUserJS.asyncOnce(this, 'videoloadstart');
        }
        else {
            return Promise.resolve();
        }
    }

    get videoemptiedPromise() {
        return BiliUserJS.asyncOnce(this, 'videoemptied');
    }

    get cidchangePromise() {
        return BiliUserJS.asyncOnce(this, 'cidchange');
    }

    get aidchangePromise() {
        return BiliUserJS.asyncOnce(this, 'aidchange');
    }

    get domcontentloadPromise() {
        if (this.playerWin.document.readyState == 'loading') {
            return BiliUserJS.asyncOnce(this, 'domcontentload');
        }
        else {
            return Promise.resolve();
        }
    }
}

export default BiliUserJS;
