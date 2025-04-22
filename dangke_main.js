var videoList = [];
var current = 0;
var frame;
var frameDom;
var intervalId;

function startPlay() {
    function playNext() {
        current++;
        if (current >= videoList.length) {
            alert("刷课完成");
            clearInterval(intervalId);
            return;
        }
        loadVideo();
    }

    function loadVideo() {
        frameDom.setAttribute("src", videoList[current].url);
        console.log("切换视频：" + videoList[current].name);
    
        setTimeout(() => {
            let video = frame.document.getElementById("video");
    
            if (!video) {
                console.error("无法获取视频元素");
                return;
            }
    
            try {
                const popupText = frame.document.querySelector(".public_text p");
                const continueBtn = frame.document.querySelector(".public_cancel");
                const submitBtn = frame.document.querySelector(".public_submit");
    
                // 检测“上次观看到”弹窗 → 点击继续观看
                if (
                    continueBtn &&
                    continueBtn.offsetParent !== null &&
                    popupText &&
                    popupText.innerText.includes("你上次观看到")
                ) {
                    continueBtn.click();
                    console.log("点击‘继续观看’，视频自动播放");
                }
    
                // 检测“完整观看”或“继续学习” 弹窗
                if (
                    submitBtn &&
                    submitBtn.offsetParent !== null &&
                    popupText &&
                    (
                        popupText.innerText.includes("您需要完整观看一遍课程视频")
                    )
                ) {
                    submitBtn.click();
                    console.log("点击‘我知道了’，视频自动播放");
                }
            } catch (e) {
                console.warn("立即检测弹窗时出错", e);
            }
    
            console.log("开始播放：" + videoList[current].name);
    
            // 定时检测弹窗（保持不变）
            setInterval(() => {
                try {
                    const popupText = frame.document.querySelector(".public_text p");
                    const continueBtn = frame.document.querySelector(".public_cancel");
                    const submitBtn = frame.document.querySelector(".public_submit");
    
                    if (
                        submitBtn &&
                        submitBtn.offsetParent !== null &&
                        popupText &&
                        (
                            popupText.innerText.includes("视频已暂停，点击按钮后继续学习")
                        )
                    ) {
                        submitBtn.click();
                        console.log("定时检测到暂停弹窗，已点击按钮以取消暂停");
                    }
                } catch (e) {
                    console.warn("定时检测暂停弹窗出错", e);
                }
            }, 1000);   
    
            video.onended = () => {
                console.log("检测到播放结束，切换下一个视频");
                playNext();
            };
        }, 5000); // 等待frame加载完成，如果网速慢自己改
    }    

    loadVideo();
}

function init() {
    var videoLiList = document.getElementsByClassName("video_lists")[0]
        .getElementsByTagName("ul")[0]
        .getElementsByTagName("li");

    for (let i = 0; i < videoLiList.length; i++) {
        const li = videoLiList[i];
        var a = li.getElementsByTagName("a")[0];
        var videoInf = {
            url: a.getAttribute("href"),
            time: parseVideoTime(li.getElementsByTagName("span")[0].innerText),
            name: a.innerText
        };
        videoList.push(videoInf);

        if (hasClass(li, "video_red1")) {
            current = i;
        }
    }

    document.write('<frameset cols="*"><frame src="' + window.location.href + '" /></frameset>');
    frame = frames[0];
    frameDom = document.getElementsByTagName("frame")[0];
}

function parseVideoTime(timeStr) {
    var l = timeStr.split(":");
    var t = (l[0] * 3600) + (l[1] * 60) + (l[2] * 1);
    return t;
}

// 之前准备点击用的，现在发现用不到这个点击，暂时不删，留着后续可能用到吧
function clickPlayBtn() {
    var e = frame.document.createEvent("MouseEvents");
    e.initEvent("click", true, true);
    var list = frame.document.getElementsByClassName("plyr__controls__item plyr__control");
    for (let i = 0; i < list.length; i++) {
        const btn = list[i];
        if (btn.getAttribute("aria-label") === "Play" || btn.getAttribute("aria-label") === "Pause") {
            btn.dispatchEvent(e);
            console.log("模拟点击播放/暂停按钮");
        }
    }
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

init();
startPlay();
