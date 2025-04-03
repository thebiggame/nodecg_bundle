(function () {
    'use strict';

    class NgTbgschedulebar extends Polymer.Element {
        static get is() {
            return 'tbg-schedulebar';
        }

        ready() {
            super.ready();
            this.tl = new gsap.timeline({autoRemoveChildren: true});

            const schedData = nodecg.Replicant("schedule:data");

            const gActive = nodecg.Replicant('projector:active');

            this.nextEvent = {};
            this.nextTimeUntil = 0;

            this.schedUpcoming = [];

            // Initialise message slideshow handlers
            this._initSlideshow();

            // Initialise nextTimeUntil calculator.
            this.updateNextTimeUntil();

            schedData.on('change', e => {
                this.handleScheduleData(e);
            });
            gActive.on('change', e => {
                this.handleWipe(e);
            });
        }

        handleWipe(newVal) {
            const outerNode = Polymer.dom(this.root).querySelector('#wipe-outer');
            const innerNode = Polymer.dom(this.root).querySelector('#wipe-inner');
            if (newVal) {
                this.tl.clear().add('in');
                this.tl.to(outerNode, 0.5, {
                    left: "10px",
                    // marginRight: "0px",
                    ease: Quart.easeOut
                }, 'in');
                this.tl.to(outerNode, 1, {
                    marginRight: "0px",
                    borderRadius: "0px 150px 150px 0px",
                    ease: Quart.easeOut
                }, 'in+=0.3');
                this.tl.to(innerNode, 1, {
                    marginRight: "0px",
                    ease: Quart.easeOut
                }, 'in+=0.7');
                this.tl.play('in');
            } else {
                this.tl.clear().add('out');
                this.tl.to(innerNode, 0.8, {
                    marginRight: "100%",
                    ease: Quart.easeInOut
                }, 'out');
                this.tl.to(outerNode, 0.8, {
                    marginRight: "2000px",
                    borderRadius: "0px 0px 0px 0px",
                    ease: Quart.easeInOut
                }, 'out+=0.3');
                this.tl.to(outerNode, 1, {
                    left: "-20%",
                    ease: Quart.easeInOut
                }, 'out+=1.2');
                this.tl.play('out');
            }
        }

        handleScheduleData(e) {
            // The Now pane is always displayed.
            const nowNode = Polymer.dom(this.root).querySelector('#sched-now-box');
            const nowContentNode = nowNode.querySelector('#sched-now-content');
            const nowTimeNode = nowNode.querySelector('#sched-now-time');

            this.nextEvent = e.now;
            this.schedUpcoming = e.upcoming;

            nowContentNode.textContent = e.now.title;
            if (Date.now() >= new Date(e.now.ts_end)) {
                // The end of the event has passed. This is a semi-invalid state.
                this.nextTitle = e.now.title;
                this.nextTime = "Please wait";
                nowTimeNode.classList.remove("alert-secondary");
                nowTimeNode.classList.remove("alert-success");
                nowTimeNode.classList.add("alert-warning");
                nowNode.classList.remove("bg-dark");
                nowNode.classList.remove("bg-primary");
                nowNode.classList.add("bg-dark");
            } else if (new Date(e.now.ts_start) <= Date.now()) {
                // The event is currently occurring.
                this.nextTime = "Now";
                nowTimeNode.classList.remove("alert-secondary");
                nowTimeNode.classList.add("alert-success");
                nowNode.classList.remove("bg-dark");
                nowNode.classList.add("bg-primary");
            } else {
                // The event is in the future.
                this.nextTime = this._formatTime(e.now.ts_start);
                nowTimeNode.classList.remove("alert-success");
                nowTimeNode.classList.add("alert-secondary");
                nowNode.classList.remove("bg-primary");
                nowNode.classList.add("bg-dark");
            }
        }

        _formatTime(timestamp) {
            var time = new Date(timestamp);
            return time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }

        _eventIsNow(start, end) {
            var start = new Date(start);
            var end = new Date(end);
            var now = new Date();

            if (start <= now && now <= end) {
                return true
            } else {
                return false;
            };
        }

        _eventIsToday(timestamp) {
            var time = new Date(timestamp);
            if (time.getDate() == new Date().getDate()) {
                return true;
            } else {
                return false;
            }
        }

        _formatDay(timestamp) {
            var time = new Date(timestamp)
            if (!this._eventIsToday(timestamp)) {
                // The event isn't today - prepend the day.
                switch (time.getDay()) {
                    case 4:
                        return "Day 0";
                    case 5:
                        return "Day 1";
                    case 6:
                        return "Day 2";
                    case 0:
                        return "Day 3";
                    default:
                        return "Day ?";
                }
            } else {
                return "Today";
            };
        }

        updateNextTimeUntil() {
            var now = new Date();
            var delta = Math.abs(new Date(this.nextEvent.ts_start) - now);
            var deltaSeconds = Math.floor(delta / (1000));
            if (deltaSeconds >= 0) {
                this.nextTimeUntil = deltaSeconds;
            } else {
                this.nextTimeUntil = 0;
            }
            // this.async(this.updateNextTimeUntil, null, 1000); 
            setTimeout( () => this.updateNextTimeUntil(), 1000);
            // setInterval(this.updateNextTimeUntil, 1000);
        };

        _formatSeconds(delta) {
            // https://stackoverflow.com/questions/13903897/javascript-return-number-of-days-hours-minutes-seconds-between-two-dates
            // calculate (and subtract) whole days
            var days = Math.floor(delta / 86400);
            delta -= days * 86400;

            // calculate (and subtract) whole hours
            var hours = Math.floor(delta / 3600) % 24;
            delta -= hours * 3600;

            // calculate (and subtract) whole minutes
            var minutes = Math.floor(delta / 60) % 60;
            delta -= minutes * 60;

            // what's left is seconds
            var seconds = Math.floor(delta % 60);

            if (days > 0) {
                // There are days at play
                return days + " day" + (days > 1 ? "s" : "")
            } else if (hours > 0) {
                // Hours remain
                return hours + " hour" + (hours > 1 ? "s" : "")
            } else if (minutes > 0) {
                // Minutes remain!
                return minutes + " minute" + (minutes > 1 ? "s" : "")
            } else if (seconds > 0) {
                // Really not long!
                return "shortly"
            }
        }

        _initSlideshow() {           
            const showNextSlide = () => {
                const slideOuter = Polymer.dom(this.root).querySelector("#sched-next-box");
                const slideInner = Polymer.dom(this.root).querySelector("#sched-next-inner");
                

                // Calculate the required animation distance.
                const slideOuterWidth = slideOuter.offsetWidth;
                const slideInnerWidth = slideInner.offsetWidth;
                
                const availableSpace = slideOuterWidth - slideInnerWidth;

                // If this is a positive integer, then there is empty space - animation not required.
                if (availableSpace > 0) {
                    // Call again in 10 seconds to see if we need to move then.
                    setTimeout(showNextSlide, 10000);
                    return;
                }

                // Otherwise, we need to animate to show the whole bar.

                this.tl.clear();
                this.tl.to(slideInner, {
                    duration: 20,
                    x: availableSpace+"px",
                    ease: "sine.inOut",
                }, ">");
                this.tl.to(slideInner, {
                    duration: 1,
                    opacity: 0,
                }, ">3");
                this.tl.set(slideInner, { x: "0px" }, ">0.5");
                this.tl.to(slideInner, {
                    duration: 1,
                    opacity: 1,
                }, ">");
                // Wait a configurable number of seconds before calling the slider again.
                this.tl.call(showNextSlide, null, ">"+(nodecg.bundleConfig.stage.schedule_scroll_interval != null ? nodecg.bundleConfig.stage.schedule_scroll_interval : 10));
            };

            // Short delay to allow for initialisation.
            setTimeout(showNextSlide, 1000);
        }
    }

    customElements.define(NgTbgschedulebar.is, NgTbgschedulebar);
})();
