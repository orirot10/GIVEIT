import React, { useEffect } from 'react';
import '../styles/pages/PrivacyPolicy.css';

const PrivacyPolicy = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'GiveIt Privacy Policy';

    return () => {
      document.title = previousTitle;
    };
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <div className="privacy-policy" dir="ltr">
      <header className="privacy-policy__header">
        <div className="privacy-policy__container">
          <h1>GiveIt Privacy Policy</h1>
          <h1 dir="rtl">מדיניות הפרטיות של GivIt</h1>
          <p>Effective Date: August 19, 2024</p>
          <p dir="rtl">תאריך תחילה: 19 באוגוסט 2024</p>
        </div>
      </header>

      <main className="privacy-policy__main privacy-policy__container">
        <section className="privacy-policy__section">
          <h2>1. Overview</h2>
          <h2 dir="rtl">1. סקירה כללית</h2>
          <p>
            GiveIt (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates a marketplace application that connects
            people who want to rent items or services. This Privacy Policy describes how we
            collect, use, disclose, and protect personal data when you use the GiveIt mobile
            application, website, and related services (collectively, the &quot;Services&quot;).
          </p>
          <p dir="rtl">
            GiveIt (&quot;אנחנו&quot;, &quot;שלנו&quot;, או &quot;אותנו&quot;) מפעילה יישום שוק המחבר
            אנשים שרוצים לשכור פריטים או שירותים. מדיניות פרטיות זו מתארת כיצד אנו
            אוספים, משתמשים, חושפים ומגנים על נתונים אישיים כאשר אתה משתמש ביישום הנייד
            של GiveIt, באתר האינטרנט ובשירותים הקשורים (ביחד, &quot;השירותים&quot;).
          </p>
          <p>
            By using the Services, you agree to the collection and use of information in
            accordance with this Privacy Policy. If you do not agree, please discontinue use of
            the Services.
          </p>
          <p dir="rtl">
            על ידי שימוש בשירותים, אתה מסכים לאיסוף ולשימוש במידע בהתאם למדיניות
            פרטיות זו. אם אינך מסכים, אנא הפסק את השימוש בשירותים.
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>2. Information We Collect</h2>
          <h2 dir="rtl">2. המידע שאנו אוספים</h2>
          <p>We collect the following categories of information to provide and improve the Services:</p>
          <p dir="rtl">אנו אוספים את הקטגוריות הבאות של מידע כדי לספק ולשפר את השירותים:</p>
          <ul>
            <li>
              <strong>Account Information:</strong> Name, email address, phone number, profile
              photo, preferred language, and password or authentication credentials when you
              create an account.
            </li>
            <li dir="rtl">
              <strong>מידע חשבון:</strong> שם, כתובת דוא"ל, מספר טלפון, תמונת פרופיל,
              שפה מועדפת וסיסמה או אישורי אימות כאשר אתה יוצר חשבון.
            </li>
            <li>
              <strong>Content You Provide:</strong> Listings, photos, descriptions, pricing,
              rental preferences, messages, reviews, and any optional information you share with
              other users or with GiveIt support.
            </li>
            <li dir="rtl">
              <strong>תוכן שאתה מספק:</strong> רישומים, תמונות, תיאורים, תמחור,
              העדפות השכרה, הודעות, ביקורות וכל מידע אופציונלי שאתה משתף עם
              משתמשים אחרים או עם תמיכת GiveIt.
            </li>
            <li>
              <strong>Transaction and Payment Data:</strong> Rental history, order details,
              billing address, payment card token (handled by secure third-party payment
              processors), payout details, and tax information when required by law.
            </li>
            <li dir="rtl">
              <strong>נתוני עסקאות ותשלומים:</strong> היסטוריית השכרות, פרטי הזמנה,
              כתובת חיוב, אסימון כרטיס תשלום (מטופל על ידי מעבדי תשלומים צד שלישי מאובטחים),
              פרטי תשלום ומידע מס כאשר נדרש על פי חוק.
            </li>
            <li>
              <strong>Usage Data:</strong> Interactions with the app, viewed listings, search
              queries, app settings, and diagnostic logs that help us troubleshoot issues and
              improve performance.
            </li>
            <li dir="rtl">
              <strong>נתוני שימוש:</strong> אינטראקציות עם האפליקציה, רישומים שנצפו, שאילתות
              חיפוש, הגדרות אפליקציה ויומני אבחון שעוזרים לנו לפתור בעיות ולשפר את הביצועים.
            </li>
            <li>
              <strong>Device and Technical Data:</strong> Device model, operating system, unique
              device identifiers, network information, crash reports, and app version.
            </li>
            <li dir="rtl">
              <strong>נתוני מכשיר וטכניים:</strong> דגם המכשיר, מערכת הפעלה, מזהי מכשיר
              ייחודיים, מידע רשת, דוחות קריסה וגרסת האפליקציה.
            </li>
            <li>
              <strong>Location Data:</strong> Approximate or precise location (with your consent)
              to show nearby listings, map interactions, pickup/drop-off locations, and fraud
              prevention signals.
            </li>
            <li dir="rtl">
              <strong>נתוני מיקום:</strong> מיקום משוער או מדויק (בהסכמתך) כדי להציג
              רישומים קרובים, אינטראקציות עם מפות, מיקומי איסוף/החזרה ואותות למניעת הונאה.
            </li>
          </ul>
        </section>

        <section className="privacy-policy__section">
          <h2>3. How We Use Information</h2>
          <h2 dir="rtl">3. כיצד אנו משתמשים במידע</h2>
          <p>We process personal data for the following purposes:</p>
          <p dir="rtl">אנו מעבדים נתונים אישיים למטרות הבאות:</p>
          <ul>
            <li>Creating and managing your GiveIt account.</li>
            <li dir="rtl">יצירה וניהול של חשבון GiveIt שלך.</li>
            <li>Facilitating rental listings, bookings, payments, and payouts.</li>
            <li dir="rtl">הקלה על רישומי השכרה, הזמנות, תשלומים ותשלומים חוזרים.</li>
            <li>Providing customer support and responding to inquiries.</li>
            <li dir="rtl">מתן תמיכת לקוחות ומענה לפניות.</li>
            <li>Personalizing content, search results, and recommendations.</li>
            <li dir="rtl">התאמה אישית של תוכן, תוצאות חיפוש והמלצות.</li>
            <li>Monitoring usage, preventing fraud, and maintaining platform safety.</li>
            <li dir="rtl">ניטור שימוש, מניעת הונאה ושמירה על בטיחות הפלטפורמה.</li>
            <li>Sending transactional communications and service-related updates.</li>
            <li dir="rtl">שליחת תקשורות עסקיות ועדכונים הקשורים לשירות.</li>
            <li>Complying with legal obligations, resolving disputes, and enforcing agreements.</li>
            <li dir="rtl">ציות לחובות משפטיות, פתרון סכסוכות ואכיפת הסכמים.</li>
            <li>Developing new features and performing analytics to improve the Services.</li>
            <li dir="rtl">פיתוח תכונות חדשות וביצוע ניתוחים לשיפור השירותים.</li>
          </ul>
        </section>

        <section className="privacy-policy__section">
          <h2>4. Legal Bases for Processing</h2>
          <h2 dir="rtl">4. בסיסים משפטיים לעיבוד</h2>
          <p>We rely on the following legal bases under applicable data protection laws:</p>
          <p dir="rtl">אנו מסתמכים על הבסיסים המשפטיים הבאים תחת חוקי הגנת הנתונים החלים:</p>
          <ul>
            <li>
              <strong>Performance of a Contract:</strong> To deliver the Services you request.
            </li>
            <li dir="rtl">
              <strong>ביצוע חוזה:</strong> כדי לספק את השירותים שאתה מבקש.
            </li>
            <li>
              <strong>Legitimate Interests:</strong> To enhance safety, improve functionality, and
              protect our rights.
            </li>
            <li dir="rtl">
              <strong>אינטרסים לגיטימיים:</strong> כדי לשפר את הבטיחות, לשפר את הפונקציונליות
              ולהגן על זכויותינו.
            </li>
            <li>
              <strong>Consent:</strong> For optional features such as marketing emails or
              location sharing, which you may withdraw at any time.
            </li>
            <li dir="rtl">
              <strong>הסכמה:</strong> לתכונות אופציונליות כגון דוא"לים שיווקיים או
              שיתוף מיקום, אותם תוכל לבטל בכל עת.
            </li>
            <li>
              <strong>Legal Obligation:</strong> To comply with accounting, taxation, anti-money
              laundering, and other regulatory requirements.
            </li>
            <li dir="rtl">
              <strong>חובה משפטית:</strong> כדי לציית לדרישות חשבונאיות, מיסוי, מניעת הלבנת
              הון ודרישות רגולטוריות אחרות.
            </li>
          </ul>
        </section>

        <section className="privacy-policy__section">
          <h2>5. How We Share Information</h2>
          <h2 dir="rtl">5. כיצד אנו משתפים מידע</h2>
          <p>We may disclose personal data in the following circumstances:</p>
          <p dir="rtl">אנו עשויים לחשוף נתונים אישיים בנסיבות הבאות:</p>
          <ul>
            <li>
              <strong>With Other Users:</strong> To enable transactions, we share relevant listing
              and profile information, ratings, and messages.
            </li>
            <li dir="rtl">
              <strong>עם משתמשים אחרים:</strong> כדי לאפשר עסקאות, אנו משתפים מידע רלוונטי
              על רישומים ופרופילים, דירוגים והודעות.
            </li>
            <li>
              <strong>Service Providers:</strong> Trusted partners who assist with payment
              processing, identity verification, hosting, analytics, cloud storage,
              communications, and customer support.
            </li>
            <li dir="rtl">
              <strong>ספקי שירות:</strong> שותפים מהימנים המסייעים בעיבוד תשלומים, אימות
              זהות, אירוח, ניתוחים, אחסון בענן, תקשורת ותמיכת לקוחות.
            </li>
            <li>
              <strong>Business Transfers:</strong> In connection with a merger, acquisition,
              financing, or sale of assets, subject to confidentiality safeguards.
            </li>
            <li dir="rtl">
              <strong>העברות עסקיות:</strong> בקשר עם מיזוג, רכישה, מימון או מכירת נכסים,
              בכפוף לאמצעי סודיות.
            </li>
            <li>
              <strong>Legal Compliance:</strong> When required by law, regulation, court order, or
              governmental request, or to protect the rights, safety, and property of GiveIt, our
              users, or others.
            </li>
            <li dir="rtl">
              <strong>ציות משפטי:</strong> כאשר נדרש על פי חוק, תקנה, צו בית משפט או בקשה
              ממשלתית, או כדי להגן על זכויות, בטיחות ורכוש של GiveIt, המשתמשים שלנו או אחרים.
            </li>
            <li>
              <strong>With Your Consent:</strong> When you direct us to share information or
              otherwise provide permission.
            </li>
            <li dir="rtl">
              <strong>בהסכמתך:</strong> כאשר אתה מורה לנו לשתף מידע או מספק הרשאה בדרך אחרת.
            </li>
          </ul>
          <p>We do not sell personal data.</p>
          <p dir="rtl">אנו לא מוכרים נתונים אישיים.</p>
        </section>

        <section className="privacy-policy__section">
          <h2>6. International Data Transfers</h2>
          <h2 dir="rtl">6. העברות נתונים בינלאומיות</h2>
          <p>
            GiveIt operates globally. Your information may be processed and stored in countries
            other than the one where you reside. When we transfer data internationally, we use
            recognized safeguards such as standard contractual clauses, data processing
            agreements, and robust security controls.
          </p>
          <p dir="rtl">
            GiveIt פועלת ברחבי העולם. המידע שלך עשוי להיות מעובד ומאוחסן במדינות
            שונות מזו שבה אתה מתגורר. כאשר אנו מעבירים נתונים בינלאומית, אנו משתמשים
            באמצעי הגנה מוכרים כגון סעיפים חוזיים סטנדרטיים, הסכמי עיבוד נתונים
            ובקרות אבטחה חזקות.
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>7. Data Retention</h2>
          <h2 dir="rtl">7. שמירת נתונים</h2>
          <p>
            We retain personal data for as long as necessary to fulfill the purposes described in
            this Privacy Policy, including providing the Services, complying with legal
            obligations, resolving disputes, and enforcing our agreements. When data is no longer
            needed, we will delete or anonymize it.
          </p>
          <p dir="rtl">
            אנו שומרים על נתונים אישיים כל עוד נדרש כדי לממש את המטרות המתוארות
            במדיניות פרטיות זו, כולל מתן השירותים, ציות לחובות משפטיות, פתרון סכסוכות
            ואכיפת ההסכמים שלנו. כאשר הנתונים כבר אינם נחוצים, אנו נמחק או נאנונימי אותם.
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>8. Your Rights and Choices</h2>
          <h2 dir="rtl">8. זכויותיך ואפשרויותיך</h2>
          <p>Depending on your location, you may have rights including to:</p>
          <p dir="rtl">בהתאם למיקומך, ייתכן שיש לך זכויות הכוללות:</p>
          <ul>
            <li>Access, update, or delete certain personal data in your account settings.</li>
            <li dir="rtl">גישה, עדכון או מחיקה של נתונים אישיים מסוימים בהגדרות החשבון שלך.</li>
            <li>Object to or restrict our processing of your personal data.</li>
            <li dir="rtl">התנגדות או הגבלת עיבוד הנתונים האישיים שלך על ידינו.</li>
            <li>Withdraw consent at any time where processing relies on consent.</li>
            <li dir="rtl">ביטול הסכמה בכל עת כאשר העיבוד מסתמך על הסכמה.</li>
            <li>
              Opt out of marketing communications by using the unsubscribe link in emails or
              changing notification preferences in the app.
            </li>
            <li dir="rtl">
              ביטול הסכמה לתקשורות שיווקיות על ידי שימוש בקישור לביטול הרישום בדוא"לים או
              שינוי העדפות ההתראות באפליקציה.
            </li>
            <li>Request a copy of your data or portability where required by law.</li>
            <li dir="rtl">בקשת עותק של הנתונים שלך או ניידות כאשר נדרש על פי חוק.</li>
          </ul>
          <p>
            To exercise these rights, contact us using the details in the <strong>Contact Us</strong>
            section. We may require verification of your identity before fulfilling your request.
          </p>
          <p dir="rtl">
            כדי לממש זכויות אלה, צור קשר איתנו באמצעות הפרטים בסעיף <strong>צור קשר</strong>.
            ייתכן שנדרוש אימות של זהותך לפני מילוי בקשתך.
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>9. Children&apos;s Privacy</h2>
          <h2 dir="rtl">9. פרטיות ילדים</h2>
          <p>
            GiveIt is not directed to children under 13 years of age (or the minimum age required
            by local law). We do not knowingly collect personal data from children. If we learn
            that personal data has been collected from a child without appropriate consent, we
            will delete it promptly. Parents or guardians who believe their child has provided us
            with personal data should contact us.
          </p>
          <p dir="rtl">
            GiveIt אינה מיועדת לילדים מתחת לגיל 13 (או הגיל המינימלי הנדרש על פי החוק המקומי).
            אנו לא אוספים ביודעין נתונים אישיים מילדים. אם נגלה שנתונים אישיים נאספו מילד
            ללא הסכמה מתאימה, נמחק אותם מיד. הורים או אפוטרופוסים שמאמינים שילדם סיפק
            לנו נתונים אישיים צריכים ליצור איתנו קשר.
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>10. Security</h2>
          <h2 dir="rtl">10. אבטחה</h2>
          <p>
            We implement administrative, technical, and physical safeguards designed to protect
            personal data against unauthorized access, disclosure, alteration, and destruction.
            These measures include encryption in transit, secure development practices, access
            controls, monitoring, and regular security reviews. However, no method of transmission
            or storage is completely secure, and we cannot guarantee absolute security.
          </p>
          <p dir="rtl">
            אנו מיישמים אמצעי הגנה אדמיניסטרטיביים, טכניים ופיזיים שנועדו להגן על
            נתונים אישיים מפני גישה לא מורשית, חשיפה, שינוי והשמדה. אמצעים אלה כוללים
            הצפנה במהלך העברה, שיטות פיתוח מאובטחות, בקרות גישה, ניטור וביקורות אבטחה
            שוטפות. עם זאת, שום שיטת העברה או אחסון אינה מאובטחת לחלוטין, ואיננו יכולים
            להבטיח אבטחה מוחלטת.
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>11. Third-Party Services and Links</h2>
          <h2 dir="rtl">11. שירותי צד שלישי וקישורים</h2>
          <p>
            The Services may contain links to third-party websites or integrations with external
            services. We are not responsible for the privacy practices of those third parties. We
            encourage you to review the privacy policies of any external services you use in
            connection with GiveIt.
          </p>
          <p dir="rtl">
            השירותים עשויים לכלול קישורים לאתרי צד שלישי או אינטגרציות עם שירותים חיצוניים.
            אנו לא אחראים לנוהלי הפרטיות של אותם צדדים שלישיים. אנו מעודדים אותך לעיין
            במדיניות הפרטיות של כל שירות חיצוני שאתה משתמש בו בקשר עם GiveIt.
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>12. Changes to This Policy</h2>
          <h2 dir="rtl">12. שינויים במדיניות זו</h2>
          <p>
            We may update this Privacy Policy from time to time. When we make material changes, we
            will notify you through the app or by other appropriate means. The latest version will
            always be available at this page, and the effective date at the top will indicate when
            it was last revised.
          </p>
          <p dir="rtl">
            אנו עשויים לעדכן את מדיניות הפרטיות הזו מעת לעת. כאשר אנו מבצעים שינויים מהותיים,
            נודיע לך דרך האפליקציה או באמצעים מתאימים אחרים. הגרסה האחרונה תהיה זמינה תמיד
            בדף זה, והתאריך היעיל בחלק העליון יציין מתי היא עודכנה לאחרונה.
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>13. Contact Us</h2>
          <h2 dir="rtl">13. צור קשר</h2>
          <p>
            If you have questions or concerns about this Privacy Policy or our data practices,
            please contact GiveIt&apos;s privacy team at:
          </p>
          <p dir="rtl">
            אם יש לך שאלות או חששות לגבי מדיניות הפרטיות הזו או נוהלי הנתונים שלנו,
            אנא צור קשר עם צוות הפרטיות של GivIt ב:
          </p>
          <p>
            Email: <a href="mailto:orirot13@gmail.com">orirot13@gmail.com</a>
            <br />
            Mailing Address: shazar 30 Tel Aviv Innovation Way, Tel Aviv, Israel 6100001
          </p>
          <p dir="rtl">
            דוא"ל: <a href="mailto:orirot13@gmail.com">orirot13@gmail.com</a>
            <br />
            כתובת דואר: צוות הפרטיות של GivIt, דרך החדשנות 123, תל אביב, ישראל 6100001
          </p>
        </section>
      </main>

      <footer className="privacy-policy__footer">
        &copy; {currentYear} GiveIt. All rights reserved.
        <p dir="rtl">&copy; {currentYear} GiveIt. כל הזכויות שמורות.</p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;