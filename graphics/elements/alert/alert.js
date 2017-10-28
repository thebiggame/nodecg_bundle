(function () {
    'use strict';

    Polymer({
        is: 'tbg-alert',

        ready() {
            this.tl = window.alertTL;
            console.log(this.tl);
            window.addEventListener('alert', e => {
                this.handleAlert(e.detail);
            });
            window.addEventListener('alert-end', e => {
                this.handleExit();
            });
        },

        handleAlert({flair, name}) {
        	const darkenNode = document.getElementById('darkener');
        	const alertFlair = this.$$('#alert-flair');
            const alertExclaim = this.$$('.exclaim');
            const border = this.$$('.border');

            // Fade out stuff
        	TweenLite.to(darkenNode, 2.5, {
				opacity: 0.5,
				ease: Power4.easeOut
			});

            this.tl.call(() => {
                this.$['name-body'].innerHTML = name;

                // Shrink name to fit if necessary
                const nameClientWidth = this.$['name-body'].clientWidth;
                const nameScrollWidth = this.$['name-body'].scrollWidth;
                if (nameScrollWidth > nameClientWidth) {
                    TweenLite.set(this.$['name-body'], {scaleX: nameClientWidth / nameScrollWidth});
                } else {
                    TweenLite.set(this.$['name-body'], {scaleX: 1});
                }

				if (flair) {
                	setTimeout(() => {
                    	nodecg.playSound('alertCue');
                	}, 0);
                }
            });

            this.tl.add('start');

			if(flair) {
            	this.tl.add('enter', "start+=3");
            	this.tl.to(alertExclaim, 3, {
                	y: 150,
					opacity: 1,
                	ease: Bounce.easeOut
            	}, 'start');
            } else {
            	this.tl.add('enter');
            }

            this.tl.to([border], 0.5, {
                scaleX: 1,
                ease: Power2.easeInOut
            }, 'enter');

			if(flair) {
				this.tl.to(alertExclaim, 0.75, {
					opacity: 0.5,
					y: -240,
                	ease: Power2.easeInOut
            	}, 'enter');
			}

            this.tl.to(this.$['name-content'], 0.5, {
                onStart() {
                },
                y: '0%',
                ease: Power2.easeInOut
            }, '-=0.1');

            this.tl.to(this.$['name-body'], 3, {
                x: '20%',
                ease: Circ.easeOut
            }, 'enter');

            // Exit
            this.tl.add('exit', '+=25');

            this.tl.to(this.$.cover, 0.511, {
                scaleY: 1,
                ease: Power2.easeIn,
                onComplete: function () {
                    this.$.cover.style.transformOrigin = 'top center';
                }.bind(this)
            }, 'exit');

            if(flair) {
				this.tl.to(alertExclaim, 0.5, {
					opacity: 0,
					y: 0,
                	ease: Power2.easeInOut
            	}, 'exit');
			}

            this.tl.set([
                border,
                this.$['name-body'],
                this.$['name-content']
            ], {
                clearProps: 'all'
            });

            this.tl.to(this.$.cover, 0.511, {
                scaleY: 0,
                ease: Power2.easeOut
            });

            this.tl.set([
                this.$.cover
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
        },


        handleExit() {
        	console.log('exiting');
            this.tl.gotoAndPlay("exit");
        }
    });
})();
