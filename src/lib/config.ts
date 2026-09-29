// Edit confirmed business information here. Empty contact values are hidden automatically.
const rawUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/,'');
export const site = {
  name: 'Upper Technology',
  tagline: 'Build. Connect. Automate. Grow.',
  url: rawUrl && /^https?:\/\//.test(rawUrl) ? rawUrl : undefined,
  email: '', phone: '', whatsapp: '',
  instagram: 'https://www.instagram.com/uppertechnology/',
  schedulingUrl: '',
  serviceAreas: ['Orlando','Kissimmee','Celebration','Central Florida'],
  languages: { en:'English',pt:'Português',es:'Español' },
  // Planning hypotheses from the business plan. Hidden until explicitly approved.
  pricing: { published:false, currency:'USD', launch:{setup:1500,monthly:79}, growth:{setup:2900,monthly:199}, automate:{setup:5500,monthly:399} },
};
