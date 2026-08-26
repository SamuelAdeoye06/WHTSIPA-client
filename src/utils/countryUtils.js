/* ═══════════════════════════════════════════════════════════════
   countryUtils.js
   Single source of truth for country data on the frontend.

   WORLD_COUNTRIES — full ISO 3166-1 list (~196 sovereign states).
   Includes: code, code3, name, dial, region (continent/region), aliases.
   Used for flag rendering, search matching, and as a local fallback.
═══════════════════════════════════════════════════════════════ */

export const ALLOWED_COUNTRIES = [
  // A
  { code: 'AF', code3: 'AFG', name: 'Afghanistan',               dial: '+93',    region: 'Asia',        aliases: [] },
  { code: 'AL', code3: 'ALB', name: 'Albania',                   dial: '+355',   region: 'Europe',      aliases: [] },
  { code: 'DZ', code3: 'DZA', name: 'Algeria',                   dial: '+213',   region: 'Africa',      aliases: [] },
  { code: 'AD', code3: 'AND', name: 'Andorra',                   dial: '+376',   region: 'Europe',      aliases: [] },
  { code: 'AO', code3: 'AGO', name: 'Angola',                    dial: '+244',   region: 'Africa',      aliases: [] },
  { code: 'AG', code3: 'ATG', name: 'Antigua and Barbuda',       dial: '+1-268', region: 'Americas',    aliases: [] },
  { code: 'AR', code3: 'ARG', name: 'Argentina',                 dial: '+54',    region: 'Americas',    aliases: [] },
  { code: 'AM', code3: 'ARM', name: 'Armenia',                   dial: '+374',   region: 'Asia',        aliases: [] },
  { code: 'AU', code3: 'AUS', name: 'Australia',                 dial: '+61',    region: 'Oceania',     aliases: ['aus', 'oz'] },
  { code: 'AT', code3: 'AUT', name: 'Austria',                   dial: '+43',    region: 'Europe',      aliases: [] },
  { code: 'AZ', code3: 'AZE', name: 'Azerbaijan',                dial: '+994',   region: 'Asia',        aliases: [] },
  // B
  { code: 'BS', code3: 'BHS', name: 'Bahamas',                   dial: '+1-242', region: 'Americas',    aliases: [] },
  { code: 'BH', code3: 'BHR', name: 'Bahrain',                   dial: '+973',   region: 'Middle East', aliases: [] },
  { code: 'BD', code3: 'BGD', name: 'Bangladesh',                dial: '+880',   region: 'Asia',        aliases: [] },
  { code: 'BB', code3: 'BRB', name: 'Barbados',                  dial: '+1-246', region: 'Americas',    aliases: [] },
  { code: 'BY', code3: 'BLR', name: 'Belarus',                   dial: '+375',   region: 'Europe',      aliases: [] },
  { code: 'BE', code3: 'BEL', name: 'Belgium',                   dial: '+32',    region: 'Europe',      aliases: [] },
  { code: 'BZ', code3: 'BLZ', name: 'Belize',                    dial: '+501',   region: 'Americas',    aliases: [] },
  { code: 'BJ', code3: 'BEN', name: 'Benin',                     dial: '+229',   region: 'Africa',      aliases: [] },
  { code: 'BT', code3: 'BTN', name: 'Bhutan',                    dial: '+975',   region: 'Asia',        aliases: [] },
  { code: 'BO', code3: 'BOL', name: 'Bolivia',                   dial: '+591',   region: 'Americas',    aliases: [] },
  { code: 'BA', code3: 'BIH', name: 'Bosnia and Herzegovina',    dial: '+387',   region: 'Europe',      aliases: ['bih'] },
  { code: 'BW', code3: 'BWA', name: 'Botswana',                  dial: '+267',   region: 'Africa',      aliases: [] },
  { code: 'BR', code3: 'BRA', name: 'Brazil',                    dial: '+55',    region: 'Americas',    aliases: [] },
  { code: 'BN', code3: 'BRN', name: 'Brunei',                    dial: '+673',   region: 'Asia',        aliases: ['brunei darussalam'] },
  { code: 'BG', code3: 'BGR', name: 'Bulgaria',                  dial: '+359',   region: 'Europe',      aliases: [] },
  { code: 'BF', code3: 'BFA', name: 'Burkina Faso',              dial: '+226',   region: 'Africa',      aliases: [] },
  { code: 'BI', code3: 'BDI', name: 'Burundi',                   dial: '+257',   region: 'Africa',      aliases: [] },
  // C
  { code: 'CV', code3: 'CPV', name: 'Cabo Verde',                dial: '+238',   region: 'Africa',      aliases: ['cape verde'] },
  { code: 'KH', code3: 'KHM', name: 'Cambodia',                  dial: '+855',   region: 'Asia',        aliases: [] },
  { code: 'CM', code3: 'CMR', name: 'Cameroon',                  dial: '+237',   region: 'Africa',      aliases: [] },
  { code: 'CA', code3: 'CAN', name: 'Canada',                    dial: '+1',     region: 'Americas',    aliases: [] },
  { code: 'CF', code3: 'CAF', name: 'Central African Republic',  dial: '+236',   region: 'Africa',      aliases: ['car', 'caf'] },
  { code: 'TD', code3: 'TCD', name: 'Chad',                      dial: '+235',   region: 'Africa',      aliases: [] },
  { code: 'CL', code3: 'CHL', name: 'Chile',                     dial: '+56',    region: 'Americas',    aliases: [] },
  { code: 'CN', code3: 'CHN', name: 'China',                     dial: '+86',    region: 'Asia',        aliases: ['prc', 'peoples republic'] },
  { code: 'CO', code3: 'COL', name: 'Colombia',                  dial: '+57',    region: 'Americas',    aliases: [] },
  { code: 'KM', code3: 'COM', name: 'Comoros',                   dial: '+269',   region: 'Africa',      aliases: [] },
  { code: 'CD', code3: 'COD', name: 'Congo (DRC)',               dial: '+243',   region: 'Africa',      aliases: ['drc', 'democratic republic'] },
  { code: 'CG', code3: 'COG', name: 'Congo (Republic)',          dial: '+242',   region: 'Africa',      aliases: [] },
  { code: 'CR', code3: 'CRI', name: 'Costa Rica',                dial: '+506',   region: 'Americas',    aliases: [] },
  { code: 'HR', code3: 'HRV', name: 'Croatia',                   dial: '+385',   region: 'Europe',      aliases: [] },
  { code: 'CU', code3: 'CUB', name: 'Cuba',                      dial: '+53',    region: 'Americas',    aliases: [] },
  { code: 'CY', code3: 'CYP', name: 'Cyprus',                    dial: '+357',   region: 'Europe',      aliases: [] },
  { code: 'CZ', code3: 'CZE', name: 'Czech Republic',            dial: '+420',   region: 'Europe',      aliases: ['czechia'] },
  // D
  { code: 'DK', code3: 'DNK', name: 'Denmark',                   dial: '+45',    region: 'Europe',      aliases: [] },
  { code: 'DJ', code3: 'DJI', name: 'Djibouti',                  dial: '+253',   region: 'Africa',      aliases: [] },
  { code: 'DM', code3: 'DMA', name: 'Dominica',                  dial: '+1-767', region: 'Americas',    aliases: [] },
  { code: 'DO', code3: 'DOM', name: 'Dominican Republic',        dial: '+1-809', region: 'Americas',    aliases: ['dominicana'] },
  // E
  { code: 'EC', code3: 'ECU', name: 'Ecuador',                   dial: '+593',   region: 'Americas',    aliases: [] },
  { code: 'EG', code3: 'EGY', name: 'Egypt',                     dial: '+20',    region: 'Africa',      aliases: [] },
  { code: 'SV', code3: 'SLV', name: 'El Salvador',               dial: '+503',   region: 'Americas',    aliases: [] },
  { code: 'GQ', code3: 'GNQ', name: 'Equatorial Guinea',         dial: '+240',   region: 'Africa',      aliases: [] },
  { code: 'ER', code3: 'ERI', name: 'Eritrea',                   dial: '+291',   region: 'Africa',      aliases: [] },
  { code: 'EE', code3: 'EST', name: 'Estonia',                   dial: '+372',   region: 'Europe',      aliases: [] },
  { code: 'SZ', code3: 'SWZ', name: 'Eswatini',                  dial: '+268',   region: 'Africa',      aliases: ['swaziland'] },
  { code: 'ET', code3: 'ETH', name: 'Ethiopia',                  dial: '+251',   region: 'Africa',      aliases: [] },
  // F
  { code: 'FJ', code3: 'FJI', name: 'Fiji',                      dial: '+679',   region: 'Oceania',     aliases: [] },
  { code: 'FI', code3: 'FIN', name: 'Finland',                   dial: '+358',   region: 'Europe',      aliases: [] },
  { code: 'FR', code3: 'FRA', name: 'France',                    dial: '+33',    region: 'Europe',      aliases: [] },
  // G
  { code: 'GA', code3: 'GAB', name: 'Gabon',                     dial: '+241',   region: 'Africa',      aliases: [] },
  { code: 'GM', code3: 'GMB', name: 'Gambia',                    dial: '+220',   region: 'Africa',      aliases: [] },
  { code: 'GE', code3: 'GEO', name: 'Georgia',                   dial: '+995',   region: 'Asia',        aliases: [] },
  { code: 'DE', code3: 'DEU', name: 'Germany',                   dial: '+49',    region: 'Europe',      aliases: ['deutschland'] },
  { code: 'GH', code3: 'GHA', name: 'Ghana',                     dial: '+233',   region: 'Africa',      aliases: [] },
  { code: 'GR', code3: 'GRC', name: 'Greece',                    dial: '+30',    region: 'Europe',      aliases: ['hellas'] },
  { code: 'GD', code3: 'GRD', name: 'Grenada',                   dial: '+1-473', region: 'Americas',    aliases: [] },
  { code: 'GT', code3: 'GTM', name: 'Guatemala',                 dial: '+502',   region: 'Americas',    aliases: [] },
  { code: 'GN', code3: 'GIN', name: 'Guinea',                    dial: '+224',   region: 'Africa',      aliases: [] },
  { code: 'GW', code3: 'GNB', name: 'Guinea-Bissau',             dial: '+245',   region: 'Africa',      aliases: [] },
  { code: 'GY', code3: 'GUY', name: 'Guyana',                    dial: '+592',   region: 'Americas',    aliases: [] },
  // H
  { code: 'HT', code3: 'HTI', name: 'Haiti',                     dial: '+509',   region: 'Americas',    aliases: [] },
  { code: 'HN', code3: 'HND', name: 'Honduras',                  dial: '+504',   region: 'Americas',    aliases: [] },
  { code: 'HU', code3: 'HUN', name: 'Hungary',                   dial: '+36',    region: 'Europe',      aliases: [] },
  // I
  { code: 'IS', code3: 'ISL', name: 'Iceland',                   dial: '+354',   region: 'Europe',      aliases: [] },
  { code: 'IN', code3: 'IND', name: 'India',                     dial: '+91',    region: 'Asia',        aliases: [] },
  { code: 'ID', code3: 'IDN', name: 'Indonesia',                 dial: '+62',    region: 'Asia',        aliases: [] },
  { code: 'IR', code3: 'IRN', name: 'Iran',                      dial: '+98',    region: 'Middle East', aliases: ['persia'] },
  { code: 'IQ', code3: 'IRQ', name: 'Iraq',                      dial: '+964',   region: 'Middle East', aliases: [] },
  { code: 'IE', code3: 'IRL', name: 'Ireland',                   dial: '+353',   region: 'Europe',      aliases: ['eire'] },
  { code: 'IL', code3: 'ISR', name: 'Israel',                    dial: '+972',   region: 'Middle East', aliases: [] },
  { code: 'IT', code3: 'ITA', name: 'Italy',                     dial: '+39',    region: 'Europe',      aliases: ['italia'] },
  // J
  { code: 'JM', code3: 'JAM', name: 'Jamaica',                   dial: '+1-876', region: 'Americas',    aliases: [] },
  { code: 'JP', code3: 'JPN', name: 'Japan',                     dial: '+81',    region: 'Asia',        aliases: ['nippon'] },
  { code: 'JO', code3: 'JOR', name: 'Jordan',                    dial: '+962',   region: 'Middle East', aliases: [] },
  // K
  { code: 'KZ', code3: 'KAZ', name: 'Kazakhstan',                dial: '+7',     region: 'Asia',        aliases: [] },
  { code: 'KE', code3: 'KEN', name: 'Kenya',                     dial: '+254',   region: 'Africa',      aliases: [] },
  { code: 'KI', code3: 'KIR', name: 'Kiribati',                  dial: '+686',   region: 'Oceania',     aliases: [] },
  { code: 'KP', code3: 'PRK', name: 'North Korea',               dial: '+850',   region: 'Asia',        aliases: ['dprk'] },
  { code: 'KR', code3: 'KOR', name: 'South Korea',               dial: '+82',    region: 'Asia',        aliases: ['korea', 'rok'] },
  { code: 'KW', code3: 'KWT', name: 'Kuwait',                    dial: '+965',   region: 'Middle East', aliases: [] },
  { code: 'KG', code3: 'KGZ', name: 'Kyrgyzstan',                dial: '+996',   region: 'Asia',        aliases: ['kyrgyz'] },
  // L
  { code: 'LA', code3: 'LAO', name: 'Laos',                      dial: '+856',   region: 'Asia',        aliases: ['lao'] },
  { code: 'LV', code3: 'LVA', name: 'Latvia',                    dial: '+371',   region: 'Europe',      aliases: [] },
  { code: 'LB', code3: 'LBN', name: 'Lebanon',                   dial: '+961',   region: 'Middle East', aliases: [] },
  { code: 'LS', code3: 'LSO', name: 'Lesotho',                   dial: '+266',   region: 'Africa',      aliases: [] },
  { code: 'LR', code3: 'LBR', name: 'Liberia',                   dial: '+231',   region: 'Africa',      aliases: [] },
  { code: 'LY', code3: 'LBY', name: 'Libya',                     dial: '+218',   region: 'Africa',      aliases: [] },
  { code: 'LI', code3: 'LIE', name: 'Liechtenstein',             dial: '+423',   region: 'Europe',      aliases: [] },
  { code: 'LT', code3: 'LTU', name: 'Lithuania',                 dial: '+370',   region: 'Europe',      aliases: [] },
  { code: 'LU', code3: 'LUX', name: 'Luxembourg',                dial: '+352',   region: 'Europe',      aliases: [] },
  // M
  { code: 'MG', code3: 'MDG', name: 'Madagascar',                dial: '+261',   region: 'Africa',      aliases: [] },
  { code: 'MW', code3: 'MWI', name: 'Malawi',                    dial: '+265',   region: 'Africa',      aliases: [] },
  { code: 'MY', code3: 'MYS', name: 'Malaysia',                  dial: '+60',    region: 'Asia',        aliases: [] },
  { code: 'MV', code3: 'MDV', name: 'Maldives',                  dial: '+960',   region: 'Asia',        aliases: [] },
  { code: 'ML', code3: 'MLI', name: 'Mali',                      dial: '+223',   region: 'Africa',      aliases: [] },
  { code: 'MT', code3: 'MLT', name: 'Malta',                     dial: '+356',   region: 'Europe',      aliases: [] },
  { code: 'MH', code3: 'MHL', name: 'Marshall Islands',          dial: '+692',   region: 'Oceania',     aliases: [] },
  { code: 'MR', code3: 'MRT', name: 'Mauritania',                dial: '+222',   region: 'Africa',      aliases: [] },
  { code: 'MU', code3: 'MUS', name: 'Mauritius',                 dial: '+230',   region: 'Africa',      aliases: [] },
  { code: 'MX', code3: 'MEX', name: 'Mexico',                    dial: '+52',    region: 'Americas',    aliases: [] },
  { code: 'FM', code3: 'FSM', name: 'Micronesia',                dial: '+691',   region: 'Oceania',     aliases: [] },
  { code: 'MD', code3: 'MDA', name: 'Moldova',                   dial: '+373',   region: 'Europe',      aliases: [] },
  { code: 'MC', code3: 'MCO', name: 'Monaco',                    dial: '+377',   region: 'Europe',      aliases: [] },
  { code: 'MN', code3: 'MNG', name: 'Mongolia',                  dial: '+976',   region: 'Asia',        aliases: [] },
  { code: 'ME', code3: 'MNE', name: 'Montenegro',                dial: '+382',   region: 'Europe',      aliases: [] },
  { code: 'MA', code3: 'MAR', name: 'Morocco',                   dial: '+212',   region: 'Africa',      aliases: [] },
  { code: 'MZ', code3: 'MOZ', name: 'Mozambique',                dial: '+258',   region: 'Africa',      aliases: [] },
  { code: 'MM', code3: 'MMR', name: 'Myanmar',                   dial: '+95',    region: 'Asia',        aliases: ['burma'] },
  // N
  { code: 'NA', code3: 'NAM', name: 'Namibia',                   dial: '+264',   region: 'Africa',      aliases: [] },
  { code: 'NR', code3: 'NRU', name: 'Nauru',                     dial: '+674',   region: 'Oceania',     aliases: [] },
  { code: 'NP', code3: 'NPL', name: 'Nepal',                     dial: '+977',   region: 'Asia',        aliases: [] },
  { code: 'NL', code3: 'NLD', name: 'Netherlands',               dial: '+31',    region: 'Europe',      aliases: ['holland', 'dutch'] },
  { code: 'NZ', code3: 'NZL', name: 'New Zealand',               dial: '+64',    region: 'Oceania',     aliases: ['nz', 'kiwi'] },
  { code: 'NI', code3: 'NIC', name: 'Nicaragua',                 dial: '+505',   region: 'Americas',    aliases: [] },
  { code: 'NE', code3: 'NER', name: 'Niger',                     dial: '+227',   region: 'Africa',      aliases: [] },
  { code: 'NG', code3: 'NGA', name: 'Nigeria',                   dial: '+234',   region: 'Africa',      aliases: ['naija'] },
  { code: 'MK', code3: 'MKD', name: 'North Macedonia',           dial: '+389',   region: 'Europe',      aliases: ['macedonia'] },
  { code: 'NO', code3: 'NOR', name: 'Norway',                    dial: '+47',    region: 'Europe',      aliases: ['norge'] },
  // O
  { code: 'OM', code3: 'OMN', name: 'Oman',                      dial: '+968',   region: 'Middle East', aliases: [] },
  // P
  { code: 'PK', code3: 'PAK', name: 'Pakistan',                  dial: '+92',    region: 'Asia',        aliases: [] },
  { code: 'PW', code3: 'PLW', name: 'Palau',                     dial: '+680',   region: 'Oceania',     aliases: [] },
  { code: 'PA', code3: 'PAN', name: 'Panama',                    dial: '+507',   region: 'Americas',    aliases: [] },
  { code: 'PG', code3: 'PNG', name: 'Papua New Guinea',          dial: '+675',   region: 'Oceania',     aliases: ['png'] },
  { code: 'PY', code3: 'PRY', name: 'Paraguay',                  dial: '+595',   region: 'Americas',    aliases: [] },
  { code: 'PE', code3: 'PER', name: 'Peru',                      dial: '+51',    region: 'Americas',    aliases: [] },
  { code: 'PH', code3: 'PHL', name: 'Philippines',               dial: '+63',    region: 'Asia',        aliases: ['pilipinas'] },
  { code: 'PL', code3: 'POL', name: 'Poland',                    dial: '+48',    region: 'Europe',      aliases: ['polska'] },
  { code: 'PT', code3: 'PRT', name: 'Portugal',                  dial: '+351',   region: 'Europe',      aliases: [] },
  // Q
  { code: 'QA', code3: 'QAT', name: 'Qatar',                     dial: '+974',   region: 'Middle East', aliases: [] },
  // R
  { code: 'RO', code3: 'ROU', name: 'Romania',                   dial: '+40',    region: 'Europe',      aliases: [] },
  { code: 'RU', code3: 'RUS', name: 'Russia',                    dial: '+7',     region: 'Europe',      aliases: ['russian federation'] },
  { code: 'RW', code3: 'RWA', name: 'Rwanda',                    dial: '+250',   region: 'Africa',      aliases: [] },
  // S
  { code: 'KN', code3: 'KNA', name: 'Saint Kitts and Nevis',     dial: '+1-869', region: 'Americas',    aliases: [] },
  { code: 'LC', code3: 'LCA', name: 'Saint Lucia',               dial: '+1-758', region: 'Americas',    aliases: [] },
  { code: 'VC', code3: 'VCT', name: 'Saint Vincent and the Grenadines', dial: '+1-784', region: 'Americas', aliases: [] },
  { code: 'WS', code3: 'WSM', name: 'Samoa',                     dial: '+685',   region: 'Oceania',     aliases: [] },
  { code: 'SM', code3: 'SMR', name: 'San Marino',                dial: '+378',   region: 'Europe',      aliases: [] },
  { code: 'ST', code3: 'STP', name: 'Sao Tome and Principe',     dial: '+239',   region: 'Africa',      aliases: [] },
  { code: 'SA', code3: 'SAU', name: 'Saudi Arabia',              dial: '+966',   region: 'Middle East', aliases: ['ksa'] },
  { code: 'SN', code3: 'SEN', name: 'Senegal',                   dial: '+221',   region: 'Africa',      aliases: [] },
  { code: 'RS', code3: 'SRB', name: 'Serbia',                    dial: '+381',   region: 'Europe',      aliases: [] },
  { code: 'SC', code3: 'SYC', name: 'Seychelles',                dial: '+248',   region: 'Africa',      aliases: [] },
  { code: 'SL', code3: 'SLE', name: 'Sierra Leone',              dial: '+232',   region: 'Africa',      aliases: [] },
  { code: 'SG', code3: 'SGP', name: 'Singapore',                 dial: '+65',    region: 'Asia',        aliases: [] },
  { code: 'SK', code3: 'SVK', name: 'Slovakia',                  dial: '+421',   region: 'Europe',      aliases: [] },
  { code: 'SI', code3: 'SVN', name: 'Slovenia',                  dial: '+386',   region: 'Europe',      aliases: [] },
  { code: 'SB', code3: 'SLB', name: 'Solomon Islands',           dial: '+677',   region: 'Oceania',     aliases: [] },
  { code: 'SO', code3: 'SOM', name: 'Somalia',                   dial: '+252',   region: 'Africa',      aliases: [] },
  { code: 'ZA', code3: 'ZAF', name: 'South Africa',              dial: '+27',    region: 'Africa',      aliases: ['rsa'] },
  { code: 'SS', code3: 'SSD', name: 'South Sudan',               dial: '+211',   region: 'Africa',      aliases: [] },
  { code: 'ES', code3: 'ESP', name: 'Spain',                     dial: '+34',    region: 'Europe',      aliases: ['espana', 'espagna'] },
  { code: 'LK', code3: 'LKA', name: 'Sri Lanka',                 dial: '+94',    region: 'Asia',        aliases: ['ceylon'] },
  { code: 'SD', code3: 'SDN', name: 'Sudan',                     dial: '+249',   region: 'Africa',      aliases: [] },
  { code: 'SR', code3: 'SUR', name: 'Suriname',                  dial: '+597',   region: 'Americas',    aliases: [] },
  { code: 'SE', code3: 'SWE', name: 'Sweden',                    dial: '+46',    region: 'Europe',      aliases: ['sverige'] },
  { code: 'CH', code3: 'CHE', name: 'Switzerland',               dial: '+41',    region: 'Europe',      aliases: ['swiss'] },
  { code: 'SY', code3: 'SYR', name: 'Syria',                     dial: '+963',   region: 'Middle East', aliases: [] },
  // T
  { code: 'TW', code3: 'TWN', name: 'Taiwan',                    dial: '+886',   region: 'Asia',        aliases: ['roc'] },
  { code: 'TJ', code3: 'TJK', name: 'Tajikistan',                dial: '+992',   region: 'Asia',        aliases: [] },
  { code: 'TZ', code3: 'TZA', name: 'Tanzania',                  dial: '+255',   region: 'Africa',      aliases: [] },
  { code: 'TH', code3: 'THA', name: 'Thailand',                  dial: '+66',    region: 'Asia',        aliases: ['thai'] },
  { code: 'TL', code3: 'TLS', name: 'Timor-Leste',               dial: '+670',   region: 'Asia',        aliases: ['east timor'] },
  { code: 'TG', code3: 'TGO', name: 'Togo',                      dial: '+228',   region: 'Africa',      aliases: [] },
  { code: 'TO', code3: 'TON', name: 'Tonga',                     dial: '+676',   region: 'Oceania',     aliases: [] },
  { code: 'TT', code3: 'TTO', name: 'Trinidad and Tobago',       dial: '+1-868', region: 'Americas',    aliases: ['t&t', 'tnc'] },
  { code: 'TN', code3: 'TUN', name: 'Tunisia',                   dial: '+216',   region: 'Africa',      aliases: [] },
  { code: 'TR', code3: 'TUR', name: 'Turkey',                    dial: '+90',    region: 'Middle East', aliases: ['turkiye'] },
  { code: 'TM', code3: 'TKM', name: 'Turkmenistan',              dial: '+993',   region: 'Asia',        aliases: [] },
  { code: 'TV', code3: 'TUV', name: 'Tuvalu',                    dial: '+688',   region: 'Oceania',     aliases: [] },
  // U
  { code: 'UG', code3: 'UGA', name: 'Uganda',                    dial: '+256',   region: 'Africa',      aliases: [] },
  { code: 'UA', code3: 'UKR', name: 'Ukraine',                   dial: '+380',   region: 'Europe',      aliases: [] },
  { code: 'AE', code3: 'ARE', name: 'United Arab Emirates',      dial: '+971',   region: 'Middle East', aliases: ['uae', 'emirates'] },
  { code: 'GB', code3: 'GBR', name: 'United Kingdom',            dial: '+44',    region: 'Europe',      aliases: ['uk', 'britain', 'england', 'great britain'] },
  { code: 'US', code3: 'USA', name: 'United States',             dial: '+1',     region: 'Americas',    aliases: ['usa', 'america', 'united states of america'] },
  { code: 'UY', code3: 'URY', name: 'Uruguay',                   dial: '+598',   region: 'Americas',    aliases: [] },
  { code: 'UZ', code3: 'UZB', name: 'Uzbekistan',                dial: '+998',   region: 'Asia',        aliases: [] },
  // V
  { code: 'VU', code3: 'VUT', name: 'Vanuatu',                   dial: '+678',   region: 'Oceania',     aliases: [] },
  { code: 'VE', code3: 'VEN', name: 'Venezuela',                 dial: '+58',    region: 'Americas',    aliases: [] },
  { code: 'VN', code3: 'VNM', name: 'Vietnam',                   dial: '+84',    region: 'Asia',        aliases: ['viet nam'] },
  // Y
  { code: 'YE', code3: 'YEM', name: 'Yemen',                     dial: '+967',   region: 'Middle East', aliases: [] },
  // Z
  { code: 'ZM', code3: 'ZMB', name: 'Zambia',                    dial: '+260',   region: 'Africa',      aliases: [] },
  { code: 'ZW', code3: 'ZWE', name: 'Zimbabwe',                  dial: '+263',   region: 'Africa',      aliases: [] },
]

export const REGIONS = ['Africa', 'Americas', 'Asia', 'Europe', 'Middle East', 'Oceania']

/* ───────────────────────────────────────────────────────────────
   getCountryFlag(code) — returns the emoji flag for a 2-letter code
───────────────────────────────────────────────────────────────── */
export function getCountryFlag(code) {
  if (!code || code.length !== 2) return '🌐'
  const offset = 127397
  return Array.from(code.toUpperCase())
    .map(c => String.fromCodePoint(c.codePointAt(0) + offset))
    .join('')
}

/* ───────────────────────────────────────────────────────────────
   matchCountrySearch(country, query)
   Returns true if the query matches the country by:
     - name substring
     - 2-letter code (exact)
     - 3-letter code (exact)
     - region substring
     - aliases substring
     - dial code prefix (e.g. '+234' or '234')
───────────────────────────────────────────────────────────────── */
export function matchCountrySearch(country, query) {
  if (!query) return true
  const q = query.trim().toLowerCase()
  if (!q) return true

  if (country.name.toLowerCase().includes(q)) return true
  if (country.code.toLowerCase() === q) return true
  if (country.code3 && country.code3.toLowerCase() === q) return true
  if (country.region && country.region.toLowerCase().includes(q)) return true
  if (country.aliases && country.aliases.some(a => a.toLowerCase().includes(q))) return true

  // dial-code search: strip leading '+' from both sides
  const dialDigits = country.dial.replace(/\D/g, '')
  const queryDigits = q.replace(/\D/g, '')
  if (queryDigits && dialDigits.startsWith(queryDigits)) return true

  return false
}
