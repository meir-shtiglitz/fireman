import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";

const ShowTypes = () => {
    const types = [
        {
            title: 'ימי הולדת',
            tags: ['ילד היומולדת הוא כוכב האירוע', 'מוזיקה', 'מזכרת', 'הומור וצחוק', 'ארוע בלתי נשכח']
        },
        {
            title: 'בתי ספר - מתנסים',
            tags: ['ארוע בלתי נשכח', 'ילדים לא יפסיקו לדבר', 'הורים כל הזמן יחמיאו', 'הומור וצחוק', 'מוזיקה', 'אש']
        },
        {
            title: 'מבוגרים',
            tags: ['הומור בלתי פוסק', 'פיות פעורים', 'טלפתיה וסוגסטיה', 'הגשה מבריקה', 'בלתי נשכח']
        },
    ]

    return(
        <div className="show-types row bs-none">
            {types.map((t,i) => <div key={i} className="show-type col-sm-3 text-center card">
                <div className="card-header">
                    <h2 className="card-title">{t.title}</h2>
                </div>
                <div className="card-body">
                    <ul>
                        {t.tags.map((l,si) => <li key={si} className="type-line">
                            <span>{l}</span><FontAwesomeIcon icon={faCheck} />
                        </li>)}
                    </ul>
                </div>
                <div className="card-footer">
                    <Link to='/#contact' className="btn btn-secondary">הזמינו הופעה</Link>
                </div>
            </div>)}
        </div>
    )
}
export default ShowTypes;