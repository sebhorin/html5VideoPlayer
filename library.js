const Hls = require('hls.js');
const apiUrl = "https://amp.chanel.com/api/";
const apiUrlVideo = apiUrl+"video";

export const isPlaying  = elem => elem.hasClass("playing");
export const setPlaying  = elem => elem.addClass("playing");
export const setPause  = elem => elem.removeClass("playing");
export const videoIsReady  = elem => elem.hasAttribute("src");

export async function loadVideo(context, cb) {
    const videoId = context.data("video-id");
    const urlVideo1 = apiUrlVideo + '?id=' + videoId + '&device=Mobile';
    const response = await fetch(urlVideo1, {method: 'POST'});
    const result = await response.json();
    let video = context[0];

    if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(result.payload.media.source[1].src);
        hls.attachMedia(video);
        video.muted = true;
        hls.on(Hls.Events.MANIFEST_PARSED, () => cb(video));
    } else {
        video.muted = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('src', result.payload.media.source[1].src);
        cb(video);
    }
}

export const createVideo = context => context && context[0] && loadVideo(context, v => {
    if (isPlaying(context) && videoIsReady(v)) v.play();
});
