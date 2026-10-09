import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldAlert, 
  Smartphone, 
  QrCode, 
  Wifi, 
  Key, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Lock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const SAFETY_TOPICS = [
  {
    id: 'phishing',
    title: 'Phishing Attacks & Deceptive Links',
    icon: ShieldAlert,
    whatIsIt: 'Phishing is a social engineering attack where malicious actors pose as legitimate organizations (like banks or tech support) to steal passwords, financial credentials, or identity documents.',
    howAttackersUseIt: 'They send urgent SMS messages or emails claiming your account is locked, directing you to fraudulent spoofed websites that look identical to official banking portals.',
    warningSigns: [
      'Urgent or threatening language ("Account suspended within 2 hours")',
      'Misspelled domain names (e.g., paypa1-security.com or hdfc-netbank.xyz)',
      'Requests to verify passwords or enter credit card PINs',
      'Unsolicited attachments with double extensions (.pdf.exe)'
    ],
    howToStaySafe: [
      'Never click direct links in unsolicited SMS or WhatsApp messages.',
      'Always type the official URL directly into your browser bookmark bar.',
      'Check browser address bar for valid TLS certificates and authentic domain spelling.'
    ]
  },
  {
    id: 'fake-apps',
    title: 'Fake Apps & Trojan Droppers',
    icon: Smartphone,
    whatIsIt: 'Malicious applications created to mimic popular games, flashlight utilities, video downloaders, or banking apps to infiltrate your mobile device.',
    howAttackersUseIt: 'Attackers distribute these via third-party APK download sites or phishing links. Once installed, they request Accessibility or Overlay permissions to hijack credentials.',
    warningSigns: [
      'Apps requesting permissions totally unrelated to their purpose (e.g. flashlight app requesting Camera + SMS + Overlay)',
      'Hidden launcher icon after installation (cannot find app on home screen)',
      'Rapid battery drain or unusual mobile data consumption in the background'
    ],
    howToStaySafe: [
      'Install applications only from verified sources like Google Play Store with Play Protect enabled.',
      'Never grant Accessibility privileges to casual utility applications.',
      'Regularly audit installed apps and remove tools you do not recognize.'
    ]
  },
  {
    id: 'otp-scams',
    title: 'OTP (One-Time Password) Fraud',
    icon: Lock,
    whatIsIt: 'Attacks aimed at deceiving victims into revealing temporary authentication codes sent via SMS or authentication apps.',
    howAttackersUseIt: 'Scammers phone victims pretending to be bank executives, electricity board agents, or courier delivery personnel, claiming an OTP is required to "cancel a fraudulent charge" or "verify identity".',
    warningSigns: [
      'Caller urgently demanding an SMS code while on the phone',
      'SMS text stating "Do not share this OTP with anyone, including bank staff"',
      'Calls from unverified mobile numbers requesting remote screen sharing (AnyDesk, TeamViewer)'
    ],
    howToStaySafe: [
      'Remember: Real bank employees or government officials will NEVER ask for your OTP.',
      'Never read SMS codes out loud over a phone call.',
      'Never install remote screen-sharing tools at the request of an incoming caller.'
    ]
  },
  {
    id: 'qr-scams',
    title: 'QR Code Scams (Quishing)',
    icon: QrCode,
    whatIsIt: 'Deceptive QR codes placed on physical surfaces, digital flyers, or online marketplaces that redirect victims to malicious payment requests or phishing links.',
    howAttackersUseIt: 'On buying/selling platforms (like OLX), scammers send a QR code claiming "Scan this QR code to receive your payment". In reality, scanning a QR code and entering a UPI PIN DEBITS money rather than crediting it.',
    warningSigns: [
      'Anyone claiming you must enter your UPI PIN to "receive" money',
      'Physical stickers pasted over legitimate merchant QR codes at checkout stands',
      'QR codes received from strangers promising quick cash prizes or crypto airdrops'
    ],
    howToStaySafe: [
      'Golden Rule: You NEVER enter your UPI PIN or password to RECEIVE money.',
      'Inspect the destination URL before confirming any action after scanning a QR code.',
      'Pay attention to merchant recipient names displayed in your payment app before entering PIN.'
    ]
  },
  {
    id: 'fake-websites',
    title: 'Fake Websites & Homograph Spoofs',
    icon: HelpCircle,
    whatIsIt: 'Websites engineered to visually clone authentic brand interfaces using lookalike character sets (Punycode / IDN homograph attacks).',
    howAttackersUseIt: 'Attackers buy domains with Cyrillic or Greek letters that resemble Latin characters (e.g. replacing Latin "a" with Cyrillic "а"). Visitors believe they are on the real website and type their passwords.',
    warningSigns: [
      'Domain name has strange prefixes like "xn--" in the browser URL bar',
      'Page displays unencrypted HTTP warnings in modern browsers',
      'Broken images, grammatical errors, or non-functional footer links'
    ],
    howToStaySafe: [
      'Use password managers—they only autofill credentials on exact, verified domains.',
      'Look closely at the browser address bar for internationalized characters.',
      'Bookmark critical banking and university portals rather than relying on search ads.'
    ]
  },
  {
    id: 'social-engineering',
    title: 'Social Engineering & Impersonation',
    icon: AlertTriangle,
    whatIsIt: 'Psychological manipulation techniques that trick individuals into making security mistakes or divulging confidential data.',
    howAttackersUseIt: 'Attackers research personal information on social media (LinkedIn, Instagram) and contact targets pretending to be senior college professors, company CEOs, or law enforcement officers.',
    warningSigns: [
      'High pressure emotional coercion: fear, artificial urgency, or flattering promises',
      'Request to bypass standard institutional procedures or verification channels',
      'Unusual requests to buy gift cards, cryptocurrency, or wire funds'
    ],
    howToStaySafe: [
      'Pause and verify independently using a known official phone number.',
      'Never allow urgent emotional tone to rush your security protocols.',
      'Report suspicious communications to college or workplace security coordinators.'
    ]
  },
  {
    id: 'malicious-downloads',
    title: 'Malicious Downloads & Drive-By Malware',
    icon: ShieldAlert,
    whatIsIt: 'Unwanted software downloaded automatically without explicit informed consent, often piggybacked inside cracked software, torrents, or cheat tools.',
    howAttackersUseIt: 'Pirated software bundles often embed cryptocurrency miners, remote access trojans (RATs), or ransomware droppers that execute quietly during setup.',
    warningSigns: [
      'Downloaded archive requires disabling Windows Defender or Android Play Protect before extracting',
      'File carries double extension (e.g., crack_keygen.zip.exe)',
      'Unfamiliar background processes consuming 100% CPU or GPU'
    ],
    howToStaySafe: [
      'Do not download pirated software or cracked APKs.',
      'Inspect cryptographic SHA-256 hashes against trusted vendor releases.',
      'Keep your operating system and web browser updated to patch web drive-by vulnerabilities.'
    ]
  },
  {
    id: 'public-wifi',
    title: 'Public Wi-Fi Risks & Evil Twins',
    icon: Wifi,
    whatIsIt: 'Unsecured wireless networks in airports, cafes, or hotels where rogue actors can sniff unencrypted traffic or deploy spoofed access points.',
    howAttackersUseIt: 'Attackers create a Wi-Fi hotspot with the exact same name as the cafe ("Free_Cafe_WiFi"). Unsuspecting users connect, routing all unencrypted data through the attacker’s machine.',
    warningSigns: [
      'Wi-Fi network has no lock icon (open / unencrypted connection)',
      'Browser displays SSL certificate warnings or untrusted authority alerts',
      'Device unexpectedly asks for credentials when connecting to a public Wi-Fi portal'
    ],
    howToStaySafe: [
      'Use a trusted VPN service when connecting to open public Wi-Fi networks.',
      'Ensure every website uses HTTPS with valid encryption before browsing.',
      'Disable "Auto-Connect to Open Wi-Fi Networks" in your Android / phone settings.'
    ]
  },
  {
    id: 'password-security',
    title: 'Password Security & Credential Stuffing',
    icon: Key,
    whatIsIt: 'Weak, reused passwords allow automated bots to breach accounts across dozens of websites after a single unrelated database breach.',
    howAttackersUseIt: 'Attackers obtain leaked credential lists from past corporate data dumps and run automated credential-stuffing tools to test the same password on banks and email providers.',
    warningSigns: [
      'Notifications from Google or Apple that your password was found in a data breach',
      'Unexpected login approval notifications on your phone from unfamiliar locations',
      'Receiving password reset emails you did not request'
    ],
    howToStaySafe: [
      'Never reuse the same password across multiple services.',
      'Use a password manager to generate 16+ character unique passphrases.',
      'Enable Multi-Factor Authentication (MFA / 2FA) using an authenticator app (not SMS).'
    ]
  },
  {
    id: 'account-security',
    title: 'Account Takeover & Device Session Hijacking',
    icon: CheckCircle2,
    whatIsIt: 'Techniques where cybercriminals steal browser session cookies or OAuth tokens to gain persistent access to personal accounts without knowing the password.',
    howAttackersUseIt: 'Info-stealer malware extracts session cookies from browser profiles, enabling criminals to bypass 2FA prompts entirely on another computer.',
    warningSigns: [
      'Sessions remaining logged in from unrecognized cities or foreign IP addresses',
      'New recovery email addresses or phone numbers added to your Google account',
      'Emails forwarded automatically to unknown inbox rules'
    ],
    howToStaySafe: [
      'Periodically review active device sessions in Google / Microsoft account settings.',
      'Log out of shared computers after completing college lab assignments.',
      'Use passkeys (FIDO2 / WebAuthn) where supported for phishing-resistant logins.'
    ]
  }
];

export function EducationPage() {
  const [expandedId, setExpandedId] = useState('phishing');

  const toggle = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 lg:pb-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border-cyan-500/20">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800">
            CYBER DEFENSE KNOWLEDGE BASE
          </span>
        </div>
        <h2 className="text-2xl font-black text-white mt-1">
          Cyber Safety Academy
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
          Comprehensive curriculum explaining modern cyber threats, fraud vectors, and actionable defense hygiene in plain language.
        </p>
      </div>

      {/* Topics Accordion Feed (Requirement #14) */}
      <div className="space-y-3">
        {SAFETY_TOPICS.map((topic) => {
          const Icon = topic.icon;
          const isExpanded = expandedId === topic.id;

          return (
            <div 
              key={topic.id}
              className={`glass-panel rounded-2xl border transition-all duration-200 overflow-hidden ${
                isExpanded ? 'border-cyan-500/40 bg-slate-950/80' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Accordion Trigger */}
              <button
                onClick={() => toggle(topic.id)}
                className="w-full p-5 flex items-center justify-between text-left transition"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-xl border ${
                    isExpanded 
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' 
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {topic.whatIsIt}
                    </p>
                  </div>
                </div>

                <div className="p-1 rounded-lg text-slate-400 hover:text-white">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Accordion Body */}
              {isExpanded && (
                <div className="p-6 pt-0 border-t border-slate-800/80 space-y-5 text-xs animate-fadeIn">
                  {/* What is it? */}
                  <div>
                    <span className="font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                      What is it?
                    </span>
                    <p className="text-slate-300 leading-relaxed text-sm bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                      {topic.whatIsIt}
                    </p>
                  </div>

                  {/* How attackers use it */}
                  <div>
                    <span className="font-bold uppercase tracking-wider text-rose-400 block mb-1">
                      How attackers use it
                    </span>
                    <p className="text-slate-300 leading-relaxed text-sm bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                      {topic.howAttackersUseIt}
                    </p>
                  </div>

                  {/* Warning Signs */}
                  <div>
                    <span className="font-bold uppercase tracking-wider text-amber-400 block mb-2">
                      Warning signs to watch for
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {topic.warningSigns.map((ws, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/30 text-amber-200">
                          ⚠️ {ws}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* How to stay safe */}
                  <div>
                    <span className="font-bold uppercase tracking-wider text-emerald-400 block mb-2">
                      How to stay safe
                    </span>
                    <div className="space-y-1.5">
                      {topic.howToStaySafe.map((ss, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-emerald-200 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{ss}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
