import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TuroVsLorepaImg from "../assets/hero.png";
import { motion } from 'framer-motion';

const translations = {
    en: {
        title: "Advantages of Lorepa vs Turo",
        postedBy: "By the Lorepa Team | Published October 25, 2024",
        introParagraph: "Given its past triumphs, the short-term rental market needs little to no introduction. From Airbnb and VRBO for residential units to Turo for vehicles, the landscape has been well-covered and those looking for additional income or diversifying investments have followed up on a profitable side hustle.",

        // New Content Sections based on 'Advantages of Lorepa vs Turo'
        section1Title: "1. A less saturated, high-demand niche",
        section1Paragraph1: "While Turo positions itself in the already highly competitive car-sharing market, Lorepa focuses on a niche that remains largely untapped — trailer rentals between individuals.",
        section1Paragraph2: "The need is significant: moving materials, personal relocations, recreational vehicles, farming, construction, and more — yet there are few simple, local solutions.",
        section1Callout: "👉 The result: less competition and greater income opportunities for each registered owner.",

        section2Title: "2. A much more affordable initial investment",
        section2Paragraph1: "Purchasing or maintaining a vehicle for Turo rentals comes with major costs — insurance, maintenance, depreciation, cleaning, etc.",
        section2Paragraph2: "In contrast, a trailer costs only between $1,250 and $2,000 and requires very little maintenance. It’s an accessible asset, quickly profitable, and ideal for generating extra income with minimal financial risk.",

        section3Title: "3. Simple and secure management through the Lorepa app",
        section3Paragraph1: "The Lorepa interface was designed to be intuitive, fast, and user-friendly — whether you’re tech-savvy or not. In just a few clicks, you can:",
        section3ListItem1: "List your trailer with photos and a clear description 📸",
        section3ListItem2: "Approve bookings safely ✅",
        section3ListItem3: "Manage your income directly from your dashboard 💰",
        section3Paragraph2: "Lorepa performs a systematic verification of each renter (identity, experience, and insurance) and requires a security deposit before each rental — ensuring peace of mind for owners.",

        section4Title: "4. Tailored insurance and full protection",
        section4Paragraph1: "While Turo’s insurance focuses on complex car policies, Lorepa partners with specialized insurers to protect every transaction.",
        section4Paragraph2: "Each rental includes: Basic insurance coverage, Systematic renter verification, And the option to add supplemental insurance.",
        section4Callout: "👉 The result: less risk and more peace of mind for both owners and renters.",

        section5Title: "5. A more predictable income model",
        section5Paragraph1: "On Turo, revenue depends on the season, mileage, vehicle type, and location.",
        section5Paragraph2: "At Lorepa, demand remains steady — driven by consistent transport and logistics needs. Each rental can bring in $50 to $120 per day, without the hidden costs tied to wear or fuel.",

        section6Title: "6. A growing local community",
        section6Paragraph1: "As a 100% Quebec-based platform, Lorepa focuses on proximity and trust between users.",
        section6Paragraph2: "Owners and renters communicate directly in a spirit of collaboration and local support. Every transaction strengthens a circular economy based on sharing and the use of existing assets.",

        section7Title: "7. A platform built for simplicity",
        section7Paragraph1: "Lorepa’s main strength lies in its simplicity — less paperwork, less management, more flexibility. Payments are automatically sent via Interac transfer, before/after photos are integrated into the app, and commissions are transparent (15%, with launch promotions as low as 10%).",
        section7Callout: "🚀 Lorepa offers a smarter, safer, and more accessible way to earn. Less cost, less stress, and more control — Lorepa is car-sharing reimagined for trailers.",


        // ROI Table Headers (Kept as requested)
        turoROITableTitle: "Turo return on investment",
        lorepaROITableTitle: "Lorepa return on investment",
        newCarHeader: "New Car",
        newTrailerHeader: "New Trailer",
        purchasePriceHeader: "Purchase price",
        dailyRentalRateHeader: "Daily rental rate",
        costHeader: "Cost (monthly maintenance & insurance)",
        incomeHeader: "Income (yearly, assuming 15 rental days/month)",
        turoData: [
            ["2022 Chevrolet Cruze", "$25,000", "$40", "$375", "$7,200"],
            ["2020 Honda Civic", "$22,000", "$35", "$350", "$6,300"],
            ["2023 Toyota Corolla", "$24,000", "$38", "$360", "$6,840"],
            ["2021 Nissan Altima", "$23,000", "$37", "$355", "$6,660"],
            ["2024 Kia Forte", "$21,000", "$33", "$340", "$5,940"]
        ],
        lorepaData: [
            ["6x12 Utility Trailer", "$3,500", "$50", "$100", "$7,200"],
            ["7x14 Enclosed Trailer", "$7,500", "$80", "$150", "$12,600"],
            ["18ft Car Hauler", "$5,000", "$70", "$120", "$10,440"],
            ["10ft Dump Trailer", "$9,000", "$95", "$180", "$14,760"],
            ["5x8 Cargo Trailer", "$2,500", "$40", "$80", "$5,760"]
        ],
        comparisonTableTitle: "Turo vs Lorepa Comparison",
        tableHeaders: ["Criterion", "Turo", "Lorepa"],
        tableData: [
            ["Asset Type", "Cars", "Trailers"],
            ["Market", "Saturated", "Growing niche"],
            ["Initial Investment", "High (vehicle)", "Low (trailer)"],
            ["Maintenance", "Frequent", "Minimal"],
            ["Insurance", "Complex, commercial", "Simple and tailored"],
            ["Revenue Potential", "Variable", "Stable and predictable"],
            ["Interface", "Advanced but dense", "Simple and intuitive"],
            ["Community", "International", "Local and friendly"]
        ]
    },
    es: {
        title: "Ventajas de Lorepa frente a Turo",
        postedBy: "Por el equipo Lorepa | Publicado el 25 de octubre de 2024",
        introParagraph: "Dado sus triunfos pasados, el mercado de alquiler a corto plazo necesita poca o ninguna presentación. Desde Airbnb y VRBO para unidades residenciales hasta Turo para vehículos, el panorama ha estado bien cubierto y aquellos que buscan ingresos adicionales o diversificar inversiones han seguido un negocio secundario rentable.",

        // New Content Sections based on 'Advantages of Lorepa vs Turo'
        section1Title: "1. Un nicho menos saturado y de alta demanda",
        section1Paragraph1: "Mientras que Turo se posiciona en el ya altamente competitivo mercado de coches compartidos, Lorepa se centra en un nicho que sigue en gran medida sin explotar: el alquiler de remolques entre particulares.",
        section1Paragraph2: "La necesidad es significativa: mover materiales, reubicaciones personales, vehículos recreativos, agricultura, construcción y más, sin embargo, hay pocas soluciones sencillas y locales.",
        section1Callout: "👉 El resultado: menos competencia y mayores oportunidades de ingresos para cada propietario registrado.",

        section2Title: "2. Una inversión inicial mucho más asequible",
        section2Paragraph1: "Comprar o mantener un vehículo para alquileres de Turo conlleva costos importantes: seguro, mantenimiento, depreciación, limpieza, etc.",
        section2Paragraph2: "Por el contrario, un remolque cuesta solo entre $1,250 y $2,000 y requiere muy poco mantenimiento. Es un activo accesible, rápidamente rentable e ideal para generar ingresos adicionales con un riesgo financiero mínimo.",

        section3Title: "3. Gestión simple y segura a través de la aplicación Lorepa",
        section3Paragraph1: "La interfaz de Lorepa fue diseñada para ser intuitiva, rápida y fácil de usar, sea o no experto en tecnología. En solo unos pocos clics, puede:",
        section3ListItem1: "Listar su remolque con fotos y una descripción clara 📸",
        section3ListItem2: "Aprobar reservas de forma segura ✅",
        section3ListItem3: "Administrar sus ingresos directamente desde su panel de control 💰",
        section3Paragraph2: "Lorepa realiza una verificación sistemática de cada inquilino (identidad, experiencia y seguro) y requiere un depósito de seguridad antes de cada alquiler, lo que garantiza la tranquilidad de los propietarios.",

        section4Title: "4. Seguro a medida y protección total",
        section4Paragraph1: "Mientras que el seguro de Turo se centra en pólizas de coche complejas, Lorepa se asocia con aseguradoras especializadas para proteger cada transacción.",
        section4Paragraph2: "Cada alquiler incluye: Cobertura de seguro básica, Verificación sistemática del inquilino, Y la opción de agregar seguro suplementario.",
        section4Callout: "👉 El resultado: menos riesgo y más tranquilidad para propietarios e inquilinos.",

        section5Title: "5. Un modelo de ingresos más predecible",
        section5Paragraph1: "En Turo, los ingresos dependen de la temporada, el kilometraje, el tipo de vehículo y la ubicación.",
        section5Paragraph2: "En Lorepa, la demanda se mantiene constante, impulsada por necesidades constantes de transporte y logística. Cada alquiler puede generar de $50 a $120 por día, sin los costos ocultos ligados al desgaste o al combustible.",

        section6Title: "6. Una comunidad local en crecimiento",
        section6Paragraph1: "Como plataforma 100% con sede en Quebec, Lorepa se centra en la proximidad y la confianza entre los usuarios.",
        section6Paragraph2: "Los propietarios e inquilinos se comunican directamente en un espíritu de colaboración y apoyo local. Cada transacción fortalece una economía circular basada en el intercambio y el uso de activos existentes.",

        section7Title: "7. Una plataforma diseñada para la simplicidad",
        section7Paragraph1: "La principal fortaleza de Lorepa radica en su simplicidad: menos papeleo, menos gestión, más flexibilidad. Los pagos se envían automáticamente a través de transferencia Interac, las fotos de antes/después están integradas en la aplicación y las comisiones son transparentes (15%, con promociones de lanzamiento tan bajas como el 10%).",
        section7Callout: "🚀 Lorepa ofrece una forma más inteligente, segura y accesible de ganar. Menos costo, menos estrés y más control: Lorepa es el coche compartido reinventado para remolques.",


        // ROI Table Headers (Kept as requested)
        turoROITableTitle: "Retorno de la inversión de Turo",
        lorepaROITableTitle: "Retorno de la inversión de Lorepa",
        newCarHeader: "Coche Nuevo",
        newTrailerHeader: "Remolque Nuevo",
        purchasePriceHeader: "Precio de compra",
        dailyRentalRateHeader: "Tarifa de alquiler diaria",
        costHeader: "Costo (mantenimiento y seguro mensuales)",
        incomeHeader: "Ingresos (anuales, asumiendo 15 días de alquiler/mes)",
        turoData: [
            ["Chevrolet Cruze 2022", "$25,000", "$40", "$375", "$7,200"],
            ["Honda Civic 2020", "$22,000", "$35", "$350", "$6,300"],
            ["Toyota Corolla 2023", "$24,000", "$38", "$360", "$6,840"],
            ["Nissan Altima 2021", "$23,000", "$37", "$355", "$6,660"],
            ["Kia Forte 2024", "$21,000", "$33", "$340", "$5,940"]
        ],
        lorepaData: [
            ["Remolque utilitario 6x12", "$3,500", "$50", "$100", "$7,200"],
            ["Remolque cerrado 7x14", "$7,500", "$80", "$150", "$12,600"],
            ["Transportador de coches de 18 pies", "$5,000", "$70", "$120", "$10,440"],
            ["Remolque volquete de 10 pies", "$9,000", "$95", "$180", "$14,760"],
            ["Remolque de carga 5x8", "$2,500", "$40", "$80", "$5,760"]
        ],
        comparisonTableTitle: "Comparación Turo vs Lorepa",
        tableHeaders: ["Criterio", "Turo", "Lorepa"],
        tableData: [
            ["Tipo de activo", "Coches", "Remolques"],
            ["Mercado", "Saturado", "Nicho en crecimiento"],
            ["Inversión inicial", "Alta (vehículo)", "Baja (remolque)"],
            ["Mantenimiento", "Frecuente", "Mínimo"],
            ["Seguro", "Complejo, comercial", "Simple y adaptado"],
            ["Potencial de ingresos", "Variable", "Estable y predecible"],
            ["Interfaz", "Avanzada pero densa", "Simple e intuitiva"],
            ["Comunidad", "Internacional", "Local y amigable"]
        ]
    },
    cn: {
        title: "Lorepa 对比 Turo 的优势",
        postedBy: "Lorepa 团队 | 发布于 2024 年 10 月 25 日",
        introParagraph: "鉴于其过去的辉煌，短期租赁市场无需过多介绍。从用于住宅单元的 Airbnb 和 VRBO 到用于车辆的 Turo，市场格局已被充分覆盖，那些寻求额外收入或多样化投资的人也紧随其后，进行有利可图的副业。",

        // New Content Sections based on 'Advantages of Lorepa vs Turo'
        section1Title: "1. 饱和度更低、需求旺盛的利基市场",
        section1Paragraph1: "Turo 定位在竞争已经非常激烈的汽车共享市场，而 Lorepa 则专注于一个尚未被充分开发的利基市场——个人间的拖车租赁。",
        section1Paragraph2: "需求巨大：搬运材料、个人搬家、休闲车辆、农业、建筑等等——然而，简单、本地化的解决方案却很少。",
        section1Callout: "👉 结果：竞争更少，为每位注册车主带来更大的收入机会。",

        section2Title: "2. 初始投资更加实惠",
        section2Paragraph1: "购买或维护用于 Turo 租赁的车辆会带来主要的成本——保险、维护、折旧、清洁等。",
        section2Paragraph2: "相比之下，拖车成本仅在 $1,250 至 $2,000 之间，并且维护需求极低。它是一种易于获得的资产，能快速盈利，是低风险赚取额外收入的理想选择。",

        section3Title: "3. 通过 Lorepa 应用程序进行简单且安全的管理",
        section3Paragraph1: "Lorepa 界面设计直观、快速且用户友好——无论您是否精通技术。只需点击几下，您就可以：",
        section3ListItem1: "上传照片和清晰描述来列出您的拖车 📸",
        section3ListItem2: "安全地批准预订 ✅",
        section3ListItem3: "直接从仪表板管理您的收入 💰",
        section3Paragraph2: "Lorepa 对每位租车人进行系统验证（身份、经验和保险），并在每次租赁前要求支付安全押金——确保车主高枕无忧。",

        section4Title: "4. 量身定制的保险和全面保护",
        section4Paragraph1: "Turo 的保险专注于复杂的汽车保单，而 Lorepa 则与专业保险公司合作，保护每笔交易。",
        section4Paragraph2: "每次租赁都包括：基本保险范围、系统性的租车人验证，以及添加补充保险的选项。",
        section4Callout: "👉 结果：风险更小，车主和租车人都更安心。",

        section5Title: "5. 更可预测的收入模式",
        section5Paragraph1: "在 Turo 上，收入取决于季节、里程、车型和位置。",
        section5Paragraph2: "在 Lorepa，需求保持稳定——由持续的运输和物流需求驱动。每次租赁每天可带来 $50 至 $120 的收入，且没有与磨损或燃油相关的隐藏成本。",

        section6Title: "6. 不断壮大的本地社区",
        section6Paragraph1: "作为 100% 基于魁北克的平台，Lorepa 专注于用户之间的邻近性和信任。",
        section6Paragraph2: "车主和租车人在协作和本地支持的精神下直接沟通。每笔交易都加强了基于共享和现有资产利用的循环经济。",

        section7Title: "7. 专为简单而构建的平台",
        section7Paragraph1: "Lorepa 的主要优势在于其简单性——更少的文书工作、更少的管理、更大的灵活性。付款通过 Interac 自动转账发送，取车前后照片集成到应用程序中，佣金透明（15%，启动促销期低至 10%）。",
        section7Callout: "🚀 Lorepa 提供了一种更智能、更安全、更易于访问的赚钱方式。更低的成本、更少的压力和更多的控制——Lorepa 是为拖车重新构想的汽车共享。",


        // ROI Table Headers (Kept as requested)
        turoROITableTitle: "Turo 投资回报率",
        lorepaROITableTitle: "Lorepa 投资回报率",
        newCarHeader: "新车",
        newTrailerHeader: "新拖车",
        purchasePriceHeader: "购买价格",
        dailyRentalRateHeader: "每日租金",
        costHeader: "成本（每月维护和保险）",
        incomeHeader: "收入（每年，假设每月租赁 15 天）",
        turoData: [
            ["2022 雪佛兰科鲁兹", "$25,000", "$40", "$375", "$7,200"],
            ["2020 本田思域", "$22,000", "$35", "$350", "$6,300"],
            ["2023 丰田卡罗拉", "$24,000", "$38", "$360", "$6,840"],
            ["2021 日产天籁", "$23,000", "$37", "$355", "$6,660"],
            ["2024 起亚福瑞迪", "$21,000", "$33", "$340", "$5,940"]
        ],
        lorepaData: [
            ["6x12 多功能拖车", "$3,500", "$50", "$100", "$7,200"],
            ["7x14 封闭式拖车", "$7,500", "$80", "$150", "$12,600"],
            ["18 英尺运车拖车", "$5,000", "$70", "$120", "$10,440"],
            ["10 英尺自卸拖车", "$9,000", "$95", "$180", "$14,760"],
            ["5x8 货运拖车", "$2,500", "$40", "$80", "$5,760"]
        ],
        comparisonTableTitle: "Turo 与 Lorepa 比较",
        tableHeaders: ["标准", "Turo", "Lorepa"],
        tableData: [
            ["资产类型", "汽车", "拖车"],
            ["市场", "饱和", "增长的利基市场"],
            ["初始投资", "高（车辆）", "低（拖车）"],
            ["维护", "频繁", "最少"],
            ["保险", "复杂，商业化", "简单且定制化"],
            ["收入潜力", "不稳定", "稳定且可预测"],
            ["界面", "高级但复杂", "简单直观"],
            ["社区", "国际化", "本地且友好"]
        ]
    },
    fr: {
        title: "Avantages de Lorepa vs Turo",
        postedBy: "Par l'équipe Lorepa | Publié le 25 octobre 2024",
        introParagraph: "Compte tenu de ses succès passés, le marché de la location à court terme n'a guère besoin d'être présenté. Des unités résidentielles d'Airbnb et VRBO aux véhicules de Turo, le paysage a été bien couvert et ceux qui recherchent un revenu supplémentaire ou qui diversifient leurs investissements ont suivi une activité secondaire rentable.",

        // New Content Sections based on 'Advantages of Lorepa vs Turo'
        section1Title: "1. Une niche moins saturée et très demandée",
        section1Paragraph1: "Alors que Turo se positionne sur le marché déjà très compétitif de l'autopartage, Lorepa se concentre sur une niche largement inexploitée : la location de remorques entre particuliers.",
        section1Paragraph2: "Le besoin est important : déménagement de matériaux, déménagements personnels, véhicules de loisirs, agriculture, construction, etc. – pourtant, il existe peu de solutions locales et simples.",
        section1Callout: "👉 Le résultat : moins de concurrence et de meilleures opportunités de revenus pour chaque propriétaire inscrit.",

        section2Title: "2. Un investissement initial beaucoup plus abordable",
        section2Paragraph1: "L'achat ou l'entretien d'un véhicule pour les locations Turo entraîne des coûts majeurs : assurance, entretien, dépréciation, nettoyage, etc.",
        section2Paragraph2: "En revanche, une remorque ne coûte qu'entre 1 250 $ et 2 000 $ et nécessite très peu d'entretien. C'est un actif accessible, rapidement rentable et idéal pour générer un revenu supplémentaire avec un risque financier minimal.",

        section3Title: "3. Gestion simple et sécurisée via l'application Lorepa",
        section3Paragraph1: "L'interface Lorepa a été conçue pour être intuitive, rapide et conviviale — que vous soyez technophile ou non. En quelques clics, vous pouvez :",
        section3ListItem1: "Lister votre remorque avec des photos et une description claire 📸",
        section3ListItem2: "Approuver les réservations en toute sécurité ✅",
        section3ListItem3: "Gérer vos revenus directement depuis votre tableau de bord 💰",
        section3Paragraph2: "Lorepa effectue une vérification systématique de chaque locataire (identité, expérience et assurance) et exige un dépôt de garantie avant chaque location — assurant la tranquillité d'esprit des propriétaires.",

        section4Title: "4. Assurance sur mesure et protection complète",
        section4Paragraph1: "Alors que l'assurance de Turo se concentre sur des polices automobiles complexes, Lorepa s'associe à des assureurs spécialisés pour protéger chaque transaction.",
        section4Paragraph2: "Chaque location comprend : Une couverture d'assurance de base, Une vérification systématique du locataire, Et la possibilité d'ajouter une assurance supplémentaire.",
        section4Callout: "👉 Le résultat : moins de risques et plus de tranquillité d'esprit pour les propriétaires et les locataires.",

        section5Title: "5. Un modèle de revenu plus prévisible",
        section5Paragraph1: "Sur Turo, les revenus dépendent de la saison, du kilométrage, du type de véhicule et de l'emplacement.",
        section5Paragraph2: "Chez Lorepa, la demande reste constante — tirée par des besoins de transport et de logistique réguliers. Chaque location peut rapporter de 50 $ à 120 $ par jour, sans les coûts cachés liés à l'usure ou au carburant.",

        section6Title: "6. Une communauté locale en pleine croissance",
        section6Paragraph1: "En tant que plateforme 100 % québécoise, Lorepa se concentre sur la proximité et la confiance entre les utilisateurs.",
        section6Paragraph2: "Les propriétaires et les locataires communiquent directement dans un esprit de collaboration et de soutien local. Chaque transaction renforce une économie circulaire basée sur le partage et l'utilisation d'actifs existants.",

        section7Title: "7. Une plateforme conçue pour la simplicité",
        section7Paragraph1: "La principale force de Lorepa réside dans sa simplicité : moins de paperasse, moins de gestion, plus de flexibilité. Les paiements sont envoyés automatiquement par virement Interac, les photos avant/après sont intégrées à l'application et les commissions sont transparentes (15 %, avec des promotions de lancement aussi basses que 10 %).",
        section7Callout: "🚀 Lorepa offre un moyen plus intelligent, plus sûr et plus accessible de gagner de l'argent. Moins de coûts, moins de stress et plus de contrôle — Lorepa est l'autopartage réinventé pour les remorques.",


        // ROI Table Headers (Kept as requested)
        turoROITableTitle: "Retour sur investissement Turo",
        lorepaROITableTitle: "Retour sur investissement Lorepa",
        newCarHeader: "Nouvelle voiture",
        newTrailerHeader: "Nouvelle remorque",
        purchasePriceHeader: "Prix d'achat",
        dailyRentalRateHeader: "Tarif de location journalier",
        costHeader: "Coût (entretien et assurance mensuels)",
        incomeHeader: "Revenu (annuel, en supposant 15 jours de location/mois)",
        turoData: [
            ["Chevrolet Cruze 2022", "$25 000", "$40", "$375", "$7 200"],
            ["Honda Civic 2020", "$22 000", "$35", "$350", "$6 300"],
            ["Toyota Corolla 2023", "$24 000", "$38", "$360", "$6 840"],
            ["Nissan Altima 2021", "$23 000", "$37", "$355", "$6 660"],
            ["Kia Forte 2024", "$21 000", "$33", "$340", "$5 940"]
        ],
        lorepaData: [
            ["Remorque utilitaire 6x12", "$3 500", "$50", "$100", "$7 200"],
            ["Remorque fermée 7x14", "$7 500", "$80", "$150", "$12 600"],
            ["Transporteur de voitures 18 pieds", "$5 000", "$70", "$120", "$10 440"],
            ["Remorque benne 10 pieds", "$9 000", "$95", "$180", "$14 760"],
            ["Remorque cargo 5x8", "$2 500", "$40", "$80", "$5 760"]
        ],
        comparisonTableTitle: "Comparaison Turo vs Lorepa",
        tableHeaders: ["Critère", "Turo", "Lorepa"],
        tableData: [
            ["Type d'actif", "Voitures", "Remorques"],
            ["Marché", "Saturé", "Niche en croissance"],
            ["Investissement initial", "Élevé (véhicule)", "Faible (remorque)"],
            ["Entretien", "Fréquent", "Minimal"],
            ["Assurance", "Complexe, commerciale", "Simple et personnalisée"],
            ["Potentiel de revenus", "Variable", "Stable et prévisible"],
            ["Interface", "Avancée mais dense", "Simple et intuitive"],
            ["Communauté", "Internationale", "Locale et conviviale"]
        ]
    }
};

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const sectionDelay = (i = 0) => ({
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { delay: 0.1 * i, duration: 0.6, ease: 'easeOut' }
    },
});

const CompareTrailer = () => {
    const [translationsData, setTranslationsData] = useState(() => {
        const storedLang = localStorage.getItem('lang');
        return translations[storedLang] || translations.fr;
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        const handleStorageChange = () => {
            const storedLang = localStorage.getItem('lang');
            setTranslationsData(translations[storedLang] || translations.fr);
        };

        window.addEventListener('storage', handleStorageChange);
        handleStorageChange(); // Call on mount to get initial language

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };

    }, []);

    // Updated contentSections array based on the NEW CONTENT
    const contentSections = [
        {
            title: '',
            paragraphs: [
                translationsData.introParagraph
            ]
        },
        {
            title: translationsData.section1Title,
            paragraphs: [
                translationsData.section1Paragraph1,
                translationsData.section1Paragraph2,
                translationsData.section1Callout
            ]
        },
        {
            title: translationsData.section2Title,
            paragraphs: [
                translationsData.section2Paragraph1,
                translationsData.section2Paragraph2
            ]
        },
        {
            title: translationsData.section3Title,
            paragraphs: [
                translationsData.section3Paragraph1,
            ],
            list: [
                translationsData.section3ListItem1,
                translationsData.section3ListItem2,
                translationsData.section3ListItem3,
            ],
            listAfterParagraphs: [
                translationsData.section3Paragraph2
            ]
        },
        {
            title: translationsData.section4Title,
            paragraphs: [
                translationsData.section4Paragraph1,
                translationsData.section4Paragraph2,
                translationsData.section4Callout
            ]
        },
        {
            title: translationsData.section5Title,
            paragraphs: [
                translationsData.section5Paragraph1,
                translationsData.section5Paragraph2
            ]
        },
        {
            title: translationsData.section6Title,
            paragraphs: [
                translationsData.section6Paragraph1,
                translationsData.section6Paragraph2
            ]
        },
        {
            title: translationsData.section7Title,
            paragraphs: [
                translationsData.section7Paragraph1,
                translationsData.section7Callout
            ]
        }
    ];

    const roiTables = [
        { title: translationsData.turoROITableTitle, id: "turo", data: translationsData.turoData, newHeader: translationsData.newCarHeader },
        { title: translationsData.lorepaROITableTitle, id: "lorepa", data: translationsData.lorepaData, newHeader: translationsData.newTrailerHeader }
    ];

    return (
        <div className="min-h-screen flex flex-col font-inter text-black">
            <Navbar currentLanguage={translationsData} />

            <main className="flex-grow px-4 sm:px-6 lg:px-[3rem] mt-10">
                {/* Animated Banner Image */}
                <motion.img
                    src={TuroVsLorepaImg}
                    alt="Turo vs Lorepa Comparison"
                    className="w-full"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeInUp}
                />

                {/* Content Section */}
                <motion.div
                    className="px-4 sm:px-6 lg:px-[3rem] mt-10"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeInUp}
                >
                    <motion.h1 className="text-4xl mb-2" variants={sectionDelay(1)}>{translationsData.title}</motion.h1>
                    <motion.p className="text-black text-sm mb-8" variants={sectionDelay(2)}>{translationsData.postedBy}</motion.p>

                    {contentSections.map((section, index) => (
                        <motion.div
                            key={index}
                            className="mb-6"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            variants={sectionDelay(index + 1)}
                        >
                            {section.title && <h2 className="text-3xl mt-8 mb-4">{section.title}</h2>}
                            {section.paragraphs.map((para, i) => (
                                <p key={i} className="mb-4 text-black">{para}</p>
                            ))}
                            {section.list && (
                                <ul className="list-disc list-inside ml-4 text-black mb-4">
                                    {section.list.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            )}
                            {section.listAfterParagraphs && section.listAfterParagraphs.map((para, i) => (
                                <p key={`list-after-${i}`} className="mb-4 text-black">{para}</p>
                            ))}
                        </motion.div>
                    ))}

                    {/* ROI Tables with Animation (Kept as requested) */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={sectionDelay(contentSections.length + 1)}
                    >
                        <h2 className="text-3xl mt-8 mb-4">{translationsData.comparisonTableTitle}</h2>
                        <div className="overflow-x-auto mb-8">
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead>
                                    <tr>
                                        {translationsData.tableHeaders.map((header, i) => (
                                            <th
                                                key={i}
                                                className="py-2 px-4 border text-left text-xs font-medium text-black"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {translationsData.tableData.map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {row.map((cell, cellIndex) => (
                                                <td
                                                    key={cellIndex}
                                                    className="py-2 px-4 border text-sm text-black"
                                                >
                                                    {cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                </motion.div>
            </main>

            <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                <Footer />
            </motion.div>
        </div>
    );
};

export default CompareTrailer;