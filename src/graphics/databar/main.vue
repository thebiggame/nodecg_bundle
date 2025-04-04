<script setup lang="ts">
    import { ExampleType } from '@thebiggame/types';
    import { Configschema, ProjectorActive, Clock } from '@thebiggame/types/schemas';
    import { useHead } from '@vueuse/head';
    import { useReplicant } from 'nodecg-vue-composable';
    import { ref, onMounted, watch } from 'vue';
    import { gsap, Quart } from "gsap";

    const text = ref('Databar');

    // Set the title of this page.
    useHead({ title: 'NodeCG Stage' });

    // Access the bundle configuration with types.
    const config = nodecg.bundleConfig as Configschema;

    // Accessing normal types.
    // const exampleType: ExampleType = { exampleProperty: 'exampleString' };

    const tl = gsap.timeline({autoRemoveChildren: true});

    // const gActive = nodecg.Replicant('projector:active');
    const gActive = useReplicant<ProjectorActive>(
    'projector:active',
    'thebiggame'
    );

    // const repInfoBody = nodecg.Replicant("event:info:body");
    // const repInfoActive = nodecg.Replicant("event:info:active");

    const musicTitle = nodecg.Replicant("music:song");
    const repMusicTitle = useReplicant<string>(
        'music:title',
        'thebiggame'
    );
    const musicArtist = nodecg.Replicant("music:artist");
    const repMusicArtist = useReplicant<string>(
        'music:artist',
        'thebiggame'
    );

    // Initialise message slideshow handlers
    // this._initSlideshow();

    // const clockRep = nodecg.Replicant('clock');
    const clockRep = useReplicant<Clock>(
        'clock',
        'thebiggame'
    );

    const netWANBwDown = nodecg.Replicant("network:wan:bandwidth:down");
    const netWANBwUp = nodecg.Replicant("network:wan:bandwidth:up");

    watch(() => gActive, (e) => {
        if (e != undefined) {
            handleWipe(e.data);
        }
    });
    watch(() => clockRep, (e) => {
        if (e != undefined) {
            updateClock(e.data);
        }
    });

    netWANBwDown.on('change', e => {
        const contentNode = document.querySelector('#net-bw-down-content');
        handleBwValue(e, contentNode);
    });
    netWANBwUp.on('change', e => {
        const contentNode = document.querySelector('#net-bw-up-content');
        handleBwValue(e, contentNode);
    });

    function handleBwValue(newVal: any, elem: Element | null) {
        if (newVal == null || elem == null) {
            return;
        }
        var content;
        if (newVal == -1) {
            // Presently unknown bandwidth data
            elem.textContent = "???";
        } else {
            let oldVal = parseInt((elem.textContent != null ? elem.textContent : "0"), 10);
            if (isNaN(oldVal)) { 
                oldVal = 0;
            }
            const target = Math.floor((newVal / 100) * 10) / 10;
            gsap.to(elem, {
                duration: 1,
                ease: 'power1.inOut',
                textContent: target,
                snap: {
                    textContent: 0.01,
                },
                onUpdate: function () {
                    elem.textContent = parseFloat((elem.textContent != null ? elem.textContent : "0")).toFixed(1);
                },
                onComplete: function () {
                    elem.textContent = target.toFixed(1);
                }
            });
            if (newVal >= nodecg.bundleConfig.network.bwHighThreshold) {
                elem.classList.add("bw-high-anim");
            } else {
                elem.classList.remove("bw-high-anim");
            }
            
        }

        
    }

    function handleWipe(newVal: boolean | undefined) {
        const outerNode = document.querySelector('#wipe-outer');
        const innerNode = document.querySelector('#wipe-inner');
        if (newVal && newVal != undefined) {
            tl.clear().add('in');
            tl.to(outerNode, 0.5, {
                top: "990px",
                // marginRight: "0px",
                ease:Quart.easeOut
            }, 'in');
            tl.to(outerNode, 1, {
                marginRight: "0px",
                borderRadius: "0px 150px 150px 0px",
                ease: Quart.easeOut
            }, 'in+=0.5');
            tl.to(innerNode, 1, {
                marginRight: "0px",
                ease: Quart.easeOut
            }, 'in+=1.0');
           tl.play('in');
        } else {
            tl.clear().add('out');
            tl.to(innerNode, 1, {
                marginRight: "100%",
                ease: Quart.easeInOut
            }, 'out');
            tl.to(outerNode, 1, {
                marginRight: "1900px",
                borderRadius: "0px 0px 0px 0px",
                ease: Quart.easeInOut
            }, 'out+=0.5');
            tl.to(outerNode, 1, {
                top: "100%",
                ease: Quart.easeInOut
            }, 'out+=1.5');
            tl.play('out');
        }
    }

    function updateClock(newVal: Clock | undefined) {
        const clockNode = document.querySelector('#clock');
        // const clockPeriodNode = document.querySelector('#clock-period');
        const dayNode = document.querySelector('#day');

        // validate types
        if (newVal == undefined || clockNode == null || dayNode == null) {
            return;
        }

        var period = new Date(newVal);
        clockNode.textContent = period.toTimeString().replace(/.*(\d{2}:\d{2}):\d{2}.*/, "$1");
        // clockPeriodNode.textContent = period.getHours() >= 12 ? 'pm' : 'am';

        if (period.getDay() == 5) {
            dayNode.textContent = '1';
        } else if (period.getDay() == 6) {
            dayNode.textContent = '2';
        } else if (period.getDay() == 0) {
            dayNode.textContent = '3';
        } else {
            dayNode.textContent = '?'
        }

    }

    function initSlideshow() {
        const slides = document.querySelectorAll("#message-box .is-message");

        let currentSlideIndex = 0;

        gsap.set(slides, { y: "100%" });
        gsap.set(slides[0], { y: "0%" });
        
        const showNextSlide = () => {
            const slides = document.querySelectorAll("#message-box .is-message");
            const totalSlides = slides.length;
            const currentSlide = slides[currentSlideIndex];
            const nextSlideIndex = (currentSlideIndex + 1) % totalSlides;
            const nextSlide = slides[nextSlideIndex];

            if (totalSlides >= 2) {
                // There are slides to animate between.
                gsap.to(currentSlide, {
                    duration: 0.5,
                    y: "-100%",
                    ease: "power4.inOut",
                    onComplete: () => {
                        gsap.set(currentSlide, { y: "100%" });
                    }
                });

                gsap.to(nextSlide, {
                    duration: 0.5,
                    y: "0%",
                    ease: "power4.inOut",
                    onComplete: () => {
                        currentSlideIndex = nextSlideIndex;
                    }
                });
            }
            
        };

        setInterval(showNextSlide, 7500);
    }

    onMounted(() => {
        // Initialise message slideshow handlers
        initSlideshow();
    })
</script>

<style>
			:host {
				position: absolute;
				width: 1920px;
				height: 1080px;
				overflow: hidden;
				/* #3c438c */
				color: #fff;
			}
			#wipe-outer {
				position: absolute;
				overflow: hidden;
				white-space: nowrap;
				top: 990px;
				left: 10px;
				right: 10px;
				bottom: 5px;
				background-color: #fff;
				border-top: solid #fff 5px;
				border-bottom: solid #fff 5px;
				border-left: solid #fff 20px;
				border-right: solid #fff 5px;
				border-radius: 0px 150px 150px 0px;
			}
			#wipe-inner {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				font-size: 35px;
				color: white;
				background-color: #3c438c;
				overflow: hidden;
			}
			#wipe-title {
				font-size: 45px;
				font-weight: 300;
				font-family: "Arial Black", "Arial Bold", Gadget, sans-serif;
				text-shadow: rgba(0,0,0, 0.5) 0 0 20px;
				background-color: #5762d7;
				border-right: solid #fff 2px;
			}
			.box-elem {
				height: 75px;
				border-left: solid #fff 2px;
				padding-left: 5px;
				padding-right: 5px;
			}
			.box-elem-message {
				height: 75px;
				border-left: solid #fff 2px;
				padding-left: 0px;
				padding-right: 10px;
				font-size: 50px;
			}
			.box-border-left {
				border-left: solid #303030 1px;
			}
			.event-num {
				color: goldenrod;
				font-family: "Arial Black", sans-serif;
			}
			.icon-primary {
				--iron-icon-height: 30px;
                --iron-icon-width: 30px;
				padding-right: 5px;
			}
			.icon-lead {
				--iron-icon-height: 100px;
                --iron-icon-width: 100px;
				padding-right: 15px;
			}
			.info-body {
				font-size: 45px;
				line-height: 125%;
				text-wrap: wrap;
				/* Chromism */
				white-space: normal;
			}
			.box-clock {
				font-family: "Arial Black",  "Arial Bold", Gadget, sans-serif;
				font-weight: 500;
				font-size: 45px;
				display: inline;
			}
			.day-trail {
				font-size: 25px;
				color: #909090;
				padding-right: 5px;
			}

			.is-message {
				position: absolute;
				width: 100%;
				height: 100%;
				background-size: cover;
				background-position: center;
				padding-left: 5px;
			}

			.icon-message {
				margin-top: -10px;
				margin-bottom: -10px;
			} 

			.anim-wiggle {
				animation: wobble 1s infinite;
				display: inline-block;
			}

			.is-message p {
				display: inline-block;
			}
			
			#day-box {
				font-size:40px;
			}
			#now-body {
				font-size: 75px;
				font-weight: 700;
			}
			#schedule {
				padding-top: 10px;
				padding-left: 10px;
			}

			/*
			.icon-bw {
				--iron-icon-height: 30px;
                --iron-icon-width: 30px;
			}
			.bw-trail {
				font-size: 15px;
				color: #909090;
				padding-left: 2px;
				vertical-align:bottom;
			}
			*/

			.icon-bw {
				font-size: 25px;
			} 
			.bw-trail {
				font-size: 15px;
				color: #909090;
				padding-left: 2px;
				vertical-align:bottom;
			}
			.day-trail {
				font-size: 25px;
				color: #909090;
				padding-left: 2px;
				vertical-align:bottom;
			}
			.bw-content {
				font-size: 25px;
			}
			.bw-high-anim {
				color: rgb(255, 127, 127);
				animation: tilt-shaking 0.15s infinite;
				transition: color 2s ease-in-out;
			}
			@keyframes tilt-shaking {
				0% { transform: translate(0, 0) rotate(0deg); }
				25% { transform: translate(1px, 1px) rotate(5deg); }
				50% { transform: translate(0, 0) rotate(0eg); }
				75% { transform: translate(-1px, 1px) rotate(-5deg); }
				100% { transform: translate(0, 0) rotate(0deg); }
			}
			@keyframes wobble {
				0% { transform: rotate(-5deg); }
				50% { transform: rotate(5deg); }
				100% { transform: rotate(-5deg); }
			}
			.event-trail {
				font-size: 30px;
				font-weight: 300;
				padding-right: 10px;
				font-family: "Arial Bold", Gadget, sans-serif;
			}
			#next-body {
				font-size: 50px;
				font-weight: 500;
			}
			#wipe-next {
				margin-top: -20px;
			}
			.sponsor-boxo > .img-fluid {
				max-height: 40px;
			}
			#music-box > .img-fluid {
				max-height: 20px;
			}
		</style>

<template>
        <div> <!--DON'T REMOVE THIS DIV OTHERWISE ANIMATION BREAKS JUST TRUST ME OKAY-->
            <div id="wipe-outer">
                <div id="wipe-inner" class="container-fluid">
                    <div id="event-data" class="row">
                        <div id="wipe-title" class="d-flex box-elem"><b class="event-num align-self-center">{{ config.event_num }}</b></div>
						<div id="net-bw-box" class="d-flex flex-column box-elem bg-dark">
							<div class="d-flex flex-grow">
								<i class="icon-bw ri-download-cloud-fill"></i>
								<div id="net-bw-down-content" class="bw-content pl-2">???</div>
								<div class="align-self-end bw-trail text-muted">Mbps</div>
							</div>
							<div class="d-flex flex-grow">
								<i class="icon-bw ri-upload-cloud-fill"></i>
								<div id="net-bw-up-content" class="bw-content pl-2">???</div>
								<div class="align-self-end bw-trail text-muted">Mbps</div>
							</div>
                        </div>
						<div id="message-box" class="d-flex box-elem-message align-self-center">
							<div class="is-message">
								<i class="mr-n2 ri-emotion-happy-fill anim-wiggle"></i>
								<p>Welcome to <b>theBIGGAME</b> <b class="event-num">{{ config.event_num }}</b>!</p>
							</div>
							<div class="is-message">
								<i class="ri-rocket-fill"></i>
								<p>Powered by <b>NG-tBG</b>, our new AV experience!</p>
							</div>
							<div class="is-message d-flex">
								<i class="ri-hand-heart-fill"></i>
								<p class="pl-2 pr-3">tBG is possible thanks to</p>
								<div class="d-flex box-elem align-items-center sponsor-boxo bg-light">
									<img class="img-fluid mx-2" src="img/sponsor_dominos.png"/>
								</div>
								<div class="d-flex box-elem align-items-center sponsor-boxo bg-secondary">
									<img class="img-fluid mx-2" src="img/sponsor_projgames.png"/>
								</div>
								<div class="d-flex box-elem align-items-center sponsor-boxo bg-secondary">
									<img class="img-fluid mx-2" src="img/sponsor_yayzi.png"/>
								</div>
							</div>
							<div class="is-message">
								<i class="mr-n2 ri-music-2-fill anim-wiggle"></i>
								<span id="music-title">{{ repMusicTitle }}</span>
								<i class="mr-n2 ri-user-line text-muted"></i>
								<span id="music-artist">{{ repMusicArtist }}</span>
							</div>
							<div class="is-message">
								<i class="mr-n2 ri-wifi-fill"></i>
								<p>thebiggame / <i class="mr-n2 ri-lock-password-line"></i> thebiggame</p>
							</div>
							<div class="is-message">
								<i class="mr-n2 ri-shield-user-fill"></i>
								<p>Please ensure your credentials are visible at all times.</p>
							</div>
						</div>
						<div id="day-box" class="d-flex box-elem bg-dark align-items-center ml-auto align-self-center">
							<div class="icon-primary text-muted align-self-center">
								<i class="icon-primary text-muted align-self-center ri-calendar-event-fill"></i>
							</div>
                            <div id="day">
								?
							</div>
							<div class="align-self-end day-trail text-muted">
								/3
							</div>
                        </div>
						<div id="clock-box" class="d-flex box-elem bg-dark">
							<div class="icon-primary text-muted align-self-center">
								<i class="ri-time-line"></i>
							</div>
							<div class="box-clock align-self-center pl-1 pr-3" id="clock"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>