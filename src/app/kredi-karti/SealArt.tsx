/* Created by Claude · INTERNAL */
import { useSvgId } from "@/components/art/filters";

/* The ₺0 seal (Figma 22630:15619, "kart aidatı yok"), inlined from
   public/assets/img/kredi-karti/badge-zero.svg so the scalloped star and its
   eight dots (`seal-star`) can turn on their own while the ring and the ₺0
   (`seal-face`) stay upright. Geometry is the export's. Decorative. */

export default function SealArt({ className }: { className?: string }) {
  const u = useSvgId();
  return (
    <svg className={className} viewBox="0 0 200 200" width="200" height="200" fill="none" overflow="visible" aria-hidden="true">
      <g>
      <g className="seal-star">
      <path d="M82.9431 19.7115C91.9385 9.31609 108.061 9.31607 117.057 19.7115L120.612 23.8196C125.269 29.2019 132.194 32.0701 139.293 31.5576L144.712 31.1664C158.423 30.1765 169.824 41.5771 168.834 55.2885L168.442 60.707C167.93 67.8062 170.798 74.7308 176.18 79.3882L180.289 82.9431C190.684 91.9385 190.684 108.061 180.289 117.057L176.18 120.612C170.798 125.269 167.93 132.194 168.442 139.293L168.834 144.712C169.824 158.423 158.423 169.824 144.711 168.834L139.293 168.442C132.194 167.93 125.269 170.798 120.612 176.18L117.057 180.289C108.061 190.684 91.9385 190.684 82.9431 180.289L79.3882 176.18C74.7308 170.798 67.8062 167.93 60.707 168.442L55.2885 168.834C41.5771 169.824 30.1765 158.423 31.1664 144.711L31.5576 139.293C32.0701 132.194 29.2019 125.269 23.8196 120.612L19.7115 117.057C9.31609 108.061 9.31607 91.9385 19.7115 82.9431L23.8196 79.3882C29.2019 74.7308 32.0701 67.8062 31.5576 60.707L31.1664 55.2885C30.1765 41.5771 41.5771 30.1765 55.2885 31.1664L60.707 31.5576C67.8062 32.0701 74.7308 29.2019 79.3882 23.8196L82.9431 19.7115Z" fill="#5E3FBC"/>
      <circle cx="133.835" cy="19.5489" r="4.51128" fill="#FFD300"/>
      <circle cx="133.835" cy="181.955" r="4.51128" fill="#FFD300"/>
      <circle cx="64.6597" cy="19.5489" r="4.51128" fill="#FFD300"/>
      <circle cx="64.6597" cy="181.955" r="4.51128" fill="#FFD300"/>
      <circle cx="180.453" cy="67.6692" r="4.51128" fill="#FFD300"/>
      <circle cx="21.0542" cy="67.6692" r="4.51128" fill="#FFD300"/>
      <circle cx="180.453" cy="135.338" r="4.51128" fill="#FFD300"/>
      <circle cx="21.0542" cy="135.338" r="4.51128" fill="#FFD300"/>
      </g>
      <path d="M12.0303 99.3626C12.2295 93.3364 14.8233 87.376 19.8135 83.0579L23.9209 79.5032C29.3032 74.8458 32.1717 67.9207 31.6592 60.8215L31.2676 55.4026C30.2779 41.6915 41.6786 30.2909 55.3896 31.2805L60.8086 31.6721C67.9077 32.1847 74.8328 29.3161 79.4902 23.9338L83.0449 19.8264C92.0404 9.43101 108.163 9.43101 117.158 19.8264L120.713 23.9338C125.37 29.3161 132.295 32.1847 139.395 31.6721L144.813 31.2805C158.525 30.2909 169.925 41.6915 168.936 55.4026L168.544 60.8215C168.031 67.9207 170.9 74.8457 176.282 79.5032L180.39 83.0579C185.38 87.376 187.974 93.3364 188.173 99.3625L12.0303 99.3626Z" fill={`url(#paint0_linear_0_10-${u})`} fillOpacity="0.2"/>
      <g filter={`url(#filter0_di_0_10-${u})`}>
      <circle cx="100.752" cy="100.752" r="57.1429" stroke={`url(#paint1_linear_0_10-${u})`} strokeWidth="2.72727" strokeLinecap="round" strokeLinejoin="round" shapeRendering="crispEdges"/>
      </g>
      <g className="seal-face" filter={`url(#filter1_d_0_10-${u})`}>
      <path d="M119.797 99.2652C119.797 103.274 119.472 106.864 118.822 110.034C118.195 113.182 117.197 115.855 115.827 118.052C114.457 120.249 112.669 121.925 110.463 123.08C108.257 124.235 105.587 124.812 102.452 124.812C98.5277 124.812 95.2885 123.804 92.7343 121.789C90.1801 119.75 88.2876 116.829 87.0569 113.024C85.8263 109.196 85.2109 104.61 85.2109 99.2652C85.2109 93.9203 85.7682 89.3454 86.8828 85.5405C88.0206 81.713 89.855 78.7801 92.386 76.7418C94.917 74.7035 98.2723 73.6843 102.452 73.6843C106.399 73.6843 109.65 74.7035 112.204 76.7418C114.782 78.7575 116.686 81.6791 117.917 85.5066C119.17 89.3114 119.797 93.8976 119.797 99.2652ZM93.4657 99.2652C93.4657 103.455 93.7444 106.954 94.3016 109.763C94.8821 112.571 95.8342 114.677 97.1577 116.081C98.4813 117.463 100.246 118.154 102.452 118.154C104.658 118.154 106.423 117.463 107.746 116.081C109.07 114.7 110.022 112.605 110.602 109.797C111.206 106.988 111.508 103.478 111.508 99.2652C111.508 95.098 111.218 91.6102 110.637 88.8019C110.057 85.9935 109.105 83.8872 107.781 82.4831C106.457 81.0562 104.681 80.3428 102.452 80.3428C100.223 80.3428 98.4464 81.0562 97.1229 82.4831C95.8226 83.8872 94.8821 85.9935 94.3016 88.8019C93.7444 91.6102 93.4657 95.098 93.4657 99.2652Z" fill="white"/>
      <path d="M70.0814 124.313C69.6032 124.313 69.0795 124.279 68.5102 124.212C67.941 124.166 67.4286 124.087 66.9732 123.974V113.593L63.6602 114.713V111.761L66.9732 110.642V108.538L63.6602 109.658V106.706L66.9732 105.587V99.752H71.9599V103.891L77.2881 102.059V105.01L71.9599 106.842V108.946L77.2881 107.114V110.031L71.9599 111.863V120.175C73.3944 119.926 74.5102 119.451 75.3071 118.75C76.1269 118.049 76.6961 117.133 77.0149 116.002C77.3565 114.871 77.5272 113.571 77.5272 112.101H82.2065C82.2065 113.661 82.0016 115.176 81.5917 116.646C81.1819 118.094 80.5101 119.394 79.5766 120.548C78.6657 121.701 77.4248 122.617 75.8536 123.296C74.3052 123.974 72.3812 124.313 70.0814 124.313Z" fill="white"/>
      </g>
      </g>
      <defs>
      <filter id={`filter0_di_0_10-${u}`} x="31.3366" y="31.3364" width="138.831" height="138.831" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feMorphology radius="1.81818" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_0_10"/>
      <feOffset/>
      <feGaussianBlur stdDeviation="4.54545"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.827451 0 0 0 0 0 0 0 0 0.3 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_10"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_10" result="shape"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="1.50376"/>
      <feGaussianBlur stdDeviation="0.75188"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="shape" result="effect2_innerShadow_0_10"/>
      </filter>
      <filter id={`filter1_d_0_10-${u}`} x="60.6526" y="72.1806" width="62.1523" height="57.1429" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="1.50376"/>
      <feGaussianBlur stdDeviation="1.50376"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_10"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_10" result="shape"/>
      </filter>
      <linearGradient id={`paint0_linear_0_10-${u}`} x1="188.173" y1="55.6962" x2="56.0659" y2="55.6962" gradientUnits="userSpaceOnUse">
      <stop stopColor="white"/>
      <stop offset="1" stopColor="white" stopOpacity="0"/>
      </linearGradient>
      <linearGradient id={`paint1_linear_0_10-${u}`} x1="100.752" y1="45.0001" x2="100.752" y2="155.639" gradientUnits="userSpaceOnUse">
      <stop stopColor="#FFD300"/>
      <stop offset="1" stopColor="#FFD300"/>
      </linearGradient>
      </defs>
    </svg>
  );
}
