import { useState } from "react";
import { apiUploadFiles } from "../api/uploadFiles";
import { validFile, validImage } from "../controlers/validFiles";

const InputFiles = ({ change, uploadMode }) => {

    const [files, setFiles] = useState();

    const filesUp = (e) => {
        console.log("files", e.target.files);
        for (let f of e.target.files) {
            if (!validFile(f)) {
                e.target.value = '';
                return alert('יש להעלות קובץ ווידאו או תמונה בלבד')
            }
        }
        setFiles(e.target.files);
        change && change(e.target.files)
    }
    const preview = () => {
        let fileElements = [];
        let key = 0;
        for (let f of files) {
            if (validImage(f)) {
                fileElements.push(<img key={key} width={50} src={URL.createObjectURL(f)} alt="preview image" />)
            } else {
                fileElements.push(<video key={key} width={50} src={URL.createObjectURL(f)}>קובץ ווידאו לא נתמך</video>
                )
            }
            key++
        }
        return fileElements;
    }

    const uploadFiles = (e) => {
        e.preventDefault();
        apiUploadFiles(files);
        setFiles(null);
    }
    return (
        <div className="input-files-wrap">
            <div className="form-group text-center">
                <label className="btn btn-outline-dark" htmlFor="files">הוספת תמונות/סרטונים:</label>
                <input style={{display: 'none'}} onChange={filesUp} multiple type="file" id="files" className="form-control" />
            </div>
            {files && <div className="preview-files">{preview()}</div>}
            {uploadMode && files && <button onClick={uploadFiles} className="btn btn-primary m-auto">העלה קבצים</button>}
        </div>
    )
}
export default InputFiles;