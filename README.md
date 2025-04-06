# theBIGGAME NodeCG Bundle

This repository stores a [NodeCG](http://github.com/nodecg/nodecg) bundle that
drives [theBIGGAME](https://thebiggame.org)'s live graphics.

## Technical Details

In _v53.2_ and newer, this bundle was heavily refactored to use Vue 5, Typescript (targetting TS2016), and Vite for
compilation.

Before then, it was a horrific mangling of raw Javascript and Polymer 2.

## How to Use

You should just be able to do `npm install`, `npm run build`, then `nodecg start`.

For Development, `npm run watch` is available for automatic builds. Updates will appear automagically in your NodeCG
instance's graphics.