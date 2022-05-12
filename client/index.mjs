
// IMPORTS

import * as alt from 'alt-client';
import * as native from 'natives';

// CODE

let enabled = false;
let renderTarget;

const SCREEN_DIAMONDS = "CASINO_DIA_PL";
const SCREEN_SKULLS = "CASINO_HLW_PL";
const SCREEN_SNOW = "CASINO_SNWFLK_PL";
const SCREEN_WIN = "CASINO_WIN_PL";

const targetName = "casinoscreen_01";
const targetModel = alt.hash('vw_vwint01_video_overlay');
const textureDict = "Prop_Screen_Vinewood";
const textureName = "BG_Wall_Colour_4x4";

const casinoInteriorId = 275201;

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

alt.setInterval(() => {
    let position = alt.Player.local.pos;
    let interior = native.getInteriorAtCoords(position.x, position.y, position.z);

    if (!enabled && interior === casinoInteriorId) {
        loadVideoWall();
    }
}, 1000);

export async function loadVideoWall() {
    unloadVideoWall()
    native.wait(100);

    native.requestStreamedTextureDict(textureDict, false);

    while(!native.hasStreamedTextureDictLoaded(textureDict)) {
        await delay(100);
    }

    native.registerNamedRendertarget(targetName, false);
    native.linkNamedRendertarget(targetModel);

    //  SET_TV_CHANNEL_PLAYLIST
    native.setTvChannelPlaylist(0, SCREEN_DIAMONDS, true);

    native.setTvAudioFrontend(true);
    native.setTvVolume(100);
    native.setTvChannel(0);

    renderTarget = native.getNamedRendertargetRenderId(targetName);

    enabled = true;
}

export function unloadVideoWall() {
    native.setTvChannel(-1);
}

alt.everyTick(() => {
    if(enabled) {
        native.setTextRenderId(renderTarget);
        
        native.setScriptGfxDrawOrder(4); // SET_SCRIPT_GFX_DRAW_ORDER
        native.setScriptGfxDrawBehindPausemenu(true); // SET_SCRIPT_GFX_DRAW_BEHIND_PAUSEMENU
        // _DRAW_INTERACTIVE_SPRITE
        native.drawInteractiveSprite(textureDict, textureName, 0.25, 0.5, 0.5, 1.0, 0.0, 255, 255, 255, 255);
        native.drawTvChannel(0.5, 0.5, 1.0, 1.0, 0.0, 255, 255, 255, 255);
        native.setTextRenderId(1);
    }
});