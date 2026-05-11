export type LoginSlide = {
  id: string
  imageSrc: string
  fallbackImageSrc: string
  title: string
  caption: string
}

export const loginSlides: LoginSlide[] = [
  {
    id: 'laser-welding-cell',
    imageSrc: '/robot-images/robot-1.jpg',
    fallbackImageSrc:
      'https://images.pexels.com/photos/34207359/pexels-photo-34207359.jpeg?auto=compress&cs=tinysrgb&w=1400',
    title: 'Laser welding cell',
    caption: 'Routine checks before each shift keep the line stable.',
  },
  {
    id: 'robot-cutting-station',
    imageSrc: '/robot-images/robot-2.jpg',
    fallbackImageSrc:
      'https://images.unsplash.com/photo-1752614671144-7eee784abf74?auto=format&fit=crop&fm=jpg&q=80&w=1800',
    title: 'Robotic welding station',
    caption: 'Automated welding checks keep fixtures, TCP, and process quality aligned.',
  },
  {
    id: 'automated-line',
    imageSrc: '/robot-images/robot-3.jpg',
    fallbackImageSrc:
      'https://images.unsplash.com/photo-1735494033576-9c882e80504c?auto=format&fit=crop&fm=jpg&q=80&w=1800',
    title: 'Laser cutting process',
    caption: 'Inspection records help operators catch drift before it affects production.',
  },
]
