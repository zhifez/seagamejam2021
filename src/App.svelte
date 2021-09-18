<script>
    import TailwindCSS from './TailwindCSS.svelte';
    import { Router, Route } from 'svelte-navigator';
    import Game from './lib/Game/Game.svelte';
    import About from './lib/About.svelte';
</script>

<TailwindCSS />

<Router>
    <Route to="/about">
        <About />
    </Route>
    <Route to="/">
        <Game />
    </Route>
</Router>
