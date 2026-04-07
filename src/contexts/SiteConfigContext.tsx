import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface SiteConfig {
    links: Record<string, string>;
    loading: boolean;
}

const SiteConfigContext = createContext<SiteConfig>({ links: {}, loading: true });

export function SiteConfigProvider({ children }: { children: ReactNode }) {
    const [links, setLinks] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSiteConfig() {
            try {
                const { data } = await supabase.from('footer_content').select('*');
                const map: Record<string, string> = {};
                data?.forEach((item: any) => map[item.key_name] = item.value);
                setLinks(map);
            } catch (e) {
                console.error('Error fetching site config:', e);
            } finally {
                setLoading(false);
            }
        }
        fetchSiteConfig();
    }, []);

    return (
        <SiteConfigContext.Provider value={{ links, loading }}>
            {children}
        </SiteConfigContext.Provider>
    );
}

export function useSiteConfig() {
    return useContext(SiteConfigContext);
}
