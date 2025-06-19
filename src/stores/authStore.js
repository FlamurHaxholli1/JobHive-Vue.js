import { defineStore } from "pinia";
import { computed, ref } from "vue";
import client from "../helpers/client.js";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore('auth', () => {
    // state
    const token = ref(localStorage.getItem('token') || null);

    // actions
    const logIn = async (user) => {
        const response = await client.post('auth/login', user);

        if (response.data) {
            token.value = response.data.token;
            localStorage.setItem('token', token.value);

            // ------------------------------------------------------
            // KJO PJESA: merr companyId nga response ose token
            // ------------------------------------------------------

            // 1. Nëse vjen prej backend direkt:
            if (response.data.companyId) {
                localStorage.setItem('companyId', response.data.companyId);
            }
            // 2. OSE nëse companyId është te user (zakonisht është kështu):
            else if (response.data.user && response.data.user.companyId) {
                localStorage.setItem('companyId', response.data.user.companyId);
            }
            // 3. OSE nëse është te tokeni (në jwt):
            else {
                try {
                    const decoded = jwtDecode(token.value);
                    if (decoded.companyId) {
                        localStorage.setItem('companyId', decoded.companyId);
                    } else {
                        localStorage.removeItem('companyId'); // hiqe nëse s'je employer
                    }
                } catch {
                    localStorage.removeItem('companyId');
                }
            }
            // ------------------------------------------------------
        }
    }

    const logOut = () => {
        token.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('companyId'); // FSHIJE EDHE KËTË KUR BOHET LOGOUT
        reset();
    }

    const reset = () => {
        token.value = null;
        // Nëse do me bo reset edhe user info tjera, shto këtu
    }

    // getters
    const isLoggedIn = computed(() => token.value !== null);
    const loggedInUser = computed(() => {
        return token.value ? jwtDecode(token.value) : null
    })

    const userRole = computed(() => {
        return token.value ? jwtDecode(token.value).role : null;
    });

    const isAdmin = computed(() => userRole.value === 'ADMIN');
    const isEmployer = computed(() => userRole.value === 'EMPLOYER');
    const isUser = computed(() => userRole.value === 'USER');

    return {
        logIn,
        logOut,
        isLoggedIn,
        loggedInUser,
        userRole,
        isAdmin,
        isEmployer,
        isUser,
        reset
    }
});
