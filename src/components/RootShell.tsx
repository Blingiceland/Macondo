import { Cinzel, Inter } from "next/font/google";
import { Macondo as MacondoFont } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
const macondoFont = MacondoFont({ weight: "400", subsets: ["latin"], variable: "--font-macondo-gf" });

const META_PIXEL_ID = "1963766060899218";

/**
 * Sameiginleg <html>/<body> skel fyrir báðar tungumálaútgáfur.
 * Rótarskipulögin í (main) og (en) nota hana með réttu lang-gildi.
 */
export default function RootShell({
    lang,
    children,
}: {
    lang: "is" | "en";
    children: React.ReactNode;
}) {
    return (
        <html lang={lang} style={{ backgroundColor: "#140c09" }}>
            <head>
                {/* Meta Pixel Code */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
 fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
`,
                    }}
                />
                <noscript>
                    <img
                        height="1"
                        width="1"
                        style={{ display: "none" }}
                        src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
                        alt=""
                    />
                </noscript>
                {/* End Meta Pixel Code */}
            </head>
            <body
                className={`${inter.variable} ${cinzel.variable} ${macondoFont.variable} antialiased`}
                style={{ background: "radial-gradient(circle at 50% 40%, rgba(198,164,108,0.06), transparent 40%), #140c09" }}
            >
                {children}
            </body>
        </html>
    );
}
