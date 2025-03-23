(function () {
    'use strict';

    class TbgAlert extends Polymer.Element {
        static get is() {
            return 'tbg-alert';
        }

        ready() {
            super.ready();
            this.tl = window.alertTL;
            window.addEventListener('alert', e => {
                this.handleAlert(e.detail);
            });
            window.addEventListener('alert-end', e => {
                this.handleExit();
            });
        }

        handleAlert({flair, name}) {
        	const darkenNode = document.getElementById('darkener');
        	const alertFlair = Polymer.dom(this.root).querySelector('#alert-flair');
            const alertExclaim = Polymer.dom(this.root).querySelector('.exclaim');

            const outerNode = Polymer.dom(this.root).querySelector('#wipe-outer');
            const innerNode = Polymer.dom(this.root).querySelector('#wipe-inner');

            // Fade out stuff
        	TweenLite.to(darkenNode, 2.5, {
				opacity: 0.75,
				ease: Power4.easeOut
			});

            this.tl.call(() => {
                this.$['name-content'].innerHTML = name;

                // Shrink name to fit if necessary
                const nameClientWidth = this.$['name-content'].clientWidth;
                const nameScrollWidth = this.$['name-content'].scrollWidth;
                if (nameScrollWidth > nameClientWidth) {
                    TweenLite.set(this.$['name-content'], {scaleX: nameClientWidth / nameScrollWidth});
                } else {
                    TweenLite.set(this.$['name-content'], {scaleX: 1});
                }

				if (flair) {
                	setTimeout(() => {
                    	nodecg.playSound('alertCue');
                	}, 0);
                }
            });

            this.tl.clear().add('start');

			if(flair) {
            	this.tl.add('enter', "start+=3");
                this.tl.to(alertExclaim, {
                    duration: 0.5,
					opacity: 1,
            	}, 'start');
            	this.tl.to(alertExclaim, {
                    duration: 3,
                	y: 150,
                	ease: "elastic.out(1.2, 0.3)"
            	}, 'start');
            } else {
            	this.tl.add('enter');
            }

			if(flair) {
				this.tl.to(alertExclaim, 0.75, {
					opacity: 0.9,
					y: -150,
                	ease: Power2.easeInOut
            	}, 'enter');
			}

            this.tl.to(outerNode, 0.25, {
                left: "100px",
                // marginRight: "0px",
                ease: Quart.easeOut
            }, 'enter');
            this.tl.to(outerNode, 1, {
                marginRight: "0px",
                ease: Quart.easeOut
            }, 'enter+=0.5');
            this.tl.to(innerNode, 0.75, {
                marginRight: "0px",
                ease: Quart.easeOut
            }, 'enter+=0.75');
            this.tl.to(outerNode, 1, {
                borderRadius: "0px 150px 150px 0px",
                ease: Quart.easeOut
            }, 'enter+=0.75');

            // Exit
            this.tl.add('exit', '+=25');

            this.tl.to(innerNode, 1, {
                marginRight: "100%",
                ease: Quart.easeInOut
            }, 'exit');
            this.tl.to(outerNode, 1, {
                marginRight: "1900px",
                borderRadius: "0px 0px 0px 0px",
                ease: Quart.easeInOut
            }, 'exit+=0.5');
            this.tl.to(outerNode, 1, {
                left: "-50px",
                ease: Quart.easeInOut
            }, 'exit+=1');

            if(flair) {
				this.tl.to(alertExclaim, 0.5, {
					opacity: 0,
					y: 0,
                	ease: Power2.easeInOut
            	}, 'exit');
			}

            this.tl.set([
                this.$['name-content']
            ], {
                clearProps: 'all'
            });

            // Fade in
            this.tl.to(darkenNode, 2, {
				opacity: 0,
				ease: Sine.easeIn
            }, '-=0.5');

            // Time padding#3c438c
            this.tl.to({}, 0.2, {});
        }


        handleExit() {
            this.tl.play("exit");
        }
    }

    customElements.define(TbgAlert.is, TbgAlert);

})();
