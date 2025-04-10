import { browser } from "$app/environment";

let installPrompt = $state(null);

if(browser){
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        installPrompt = e;
        //installButton.removeAttribute('hidden');
    });

    window.addEventListener('appinstalled', () => {});

    
}