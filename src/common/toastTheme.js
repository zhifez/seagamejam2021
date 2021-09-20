import { toast } from '@zerodevx/svelte-toast'

export const success = m => toast.push(m, {
    theme: {
        '--toastBackground': 'rgba(16, 185, 129)',
        '--toastColor': 'white',
        '--toastBarBackground': 'olive'
    }
});

export const warning = m => toast.push(m, {
    theme: {
        '--toastBackground': 'rgba(251, 191, 36)',
        '--toastColor': 'black',
        '--toastBarBackground': 'olive'
    }
});

export const failure = m => toast.push(m, {
    theme: {
        '--toastBackground': 'rgba(248, 113, 113)',
        '--toastColor': 'white',
        '--toastBarBackground': 'olive'
    }
});