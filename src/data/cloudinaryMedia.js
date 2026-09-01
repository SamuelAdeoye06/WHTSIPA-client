/**
 * All video URLs currently point to a personal Cloudinary account
 * (cloud_name: dqch0tjrm) used during development. Once the client sets
 * up their own Cloudinary account, migrate like this:
 *
 *   1. Log into the NEW account's dashboard → Media Library
 *   2. Use "Upload" → "Fetch from URL" (or the Admin API's fetch/remote-upload)
 *      and paste each ORIGINAL_URL below directly — Cloudinary pulls the
 *      file from the old account for you, no manual download/reupload needed
 *   3. Copy the new secure_url Cloudinary gives you back
 *   4. Paste it in as the new value below — every component importing from
 *      this file picks up the change automatically, nothing else to touch
 *
 * Keep the `vc_h264` transformation on every video — it forces H.264 codec
 * output, which is what makes these play reliably across browsers
 * (Safari especially is picky about other codecs in MP4 containers).
 */

export const CLOUDINARY_VIDEOS = {
  // theEquation:   'https://res.cloudinary.com/dqch0tjrm/video/upload/vc_h264/v1780406757/the-equation_vs2zsc.mp4',
  // lazarus:       'https://res.cloudinary.com/dqch0tjrm/video/upload/vc_h264/v1780248016/lazarus_nhudt2.mp4',
  // apt29:         'https://res.cloudinary.com/dqch0tjrm/video/upload/vc_h264/v1780492583/apt29_lwnncf.mp4',
  // shadowBrokers: 'https://res.cloudinary.com/dqch0tjrm/video/upload/vc_h264/v1780463969/shadow-brokers_ga6tmk.mp4',
  // virus:         'https://res.cloudinary.com/dqch0tjrm/video/upload/vc_h264/v1780384928/virus_aol82c.mp4',
  // anonymous:     'https://res.cloudinary.com/dqch0tjrm/video/upload/vc_h264/v1780406450/anonymous_mtu7vb.mp4',
  // theHackers:    'https://res.cloudinary.com/dqch0tjrm/video/upload/vc_h264/v1781208116/the-hackers_vdy1uk.mp4',
  // heroVideo:     'https://res.cloudinary.com/dqch0tjrm/video/upload/vc_h264/v1782308519/hero-video-comp_zzd0se.mp4',

  theEquation:   'https://res.cloudinary.com/maino9d4/video/upload/vc_h264/v1788253443/the-equation.mp4',
  lazarus:       'https://res.cloudinary.com/maino9d4/video/upload/vc_h264/v1788253046/lazarus.mp4',
  apt29:         'https://res.cloudinary.com/maino9d4/video/upload/vc_h264/v1788252862/apt29.mp4',
  shadowBrokers: 'https://res.cloudinary.com/maino9d4/video/upload/vc_h264/v1788253003/shadow-brokers.mp4',
  virus:         'https://res.cloudinary.com/maino9d4/video/upload/vc_h264/v1788253382/virus.mp4',
  anonymous:     'https://res.cloudinary.com/maino9d4/video/upload/vc_h264/v1788252830/anonymous.mp4',
  theHackers:    'https://res.cloudinary.com/maino9d4/video/upload/vc_h264/v1788253365/the-hackers.mp4',
  heroVideo:     'https://res.cloudinary.com/maino9d4/video/upload/vc_h264/v1788252949/hero-video-comp.mp4',
}
