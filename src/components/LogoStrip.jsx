import { useTheme } from './ThemeContext'

export default function LogoStrip() {
  const { isDark } = useTheme()

  const logos = [
    {
      name: 'Lofty',
      src: 'https://help.lofty.com/hc/article_attachments/19995296474651',
    },
    {
      name: 'Global Hacks',
      src: 'https://www.globehack.dev/images/hero-orb.png',
    },
    {
      name: 'ACM ASU',
      src: 'https://media.licdn.com/dms/image/v2/D560BAQGXjoT60PXHIg/company-logo_200_200/company-logo_200_200/0/1735840564136/acm_at_asu_logo?e=2147483647&v=beta&t=ESf_I3dqDGMHbwen-M4qkKuNRuHLbZdmI9QRrY8QaEM',
    },
  ]

  return (
    <div
      className={`mt-6 rounded-[28px] px-5 py-4 ${
        isDark ? 'surface-dark' : 'surface-light'
      }`}
    >
      <div className="flex flex-wrap items-center justify-center gap-8 md:justify-between">
        {logos.map((logo) => (
          <div key={logo.name} className="flex items-center gap-3">
            <img
              src={logo.src}
              alt={logo.name}
              className="h-10 w-auto rounded object-contain"
            />
            <span className={`text-sm font-semibold ${isDark ? 'muted-dark' : 'muted-light'}`}>
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}