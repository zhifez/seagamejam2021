<script>
    import TailwindCSS from './TailwindCSS.svelte';
    import { Router, Route } from 'svelte-navigator';
    import { SvelteToast } from '@zerodevx/svelte-toast'
    import Game from './lib/Game/Game.svelte';
    import About from './lib/About.svelte';

    const options = {
        duration: 2000,
        initial: 1,
        next: 0,
        pausable: false,
        dismissable: true,
        reversed: false,
        // intro: { x: 256 },
        // reversed: true,
        intro: { y: -192 },
        theme: {
            'green': 'text-green-500',
            'yellow': 'text-yellow-800',
            'red': 'text-red-600'
        },
    };
</script>

<TailwindCSS />

<SvelteToast options={options} />

<Router>
    <Route to="/about">
        <About />
    </Route>
    <Route to="/">
        <Game />
    </Route>
</Router>
