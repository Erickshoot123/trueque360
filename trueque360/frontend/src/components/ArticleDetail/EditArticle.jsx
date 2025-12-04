// Archivo renombrado/convertido a stub para evitar que una versión incompleta rompa el build
import React from 'react';

function EditArticle() {
 HEAD
    const { id } = useParams(); 

    // Estados para cada campo del formulario
    const [article, setArticle] = useState(null);
    // const [title, setTitle] = useState('');
    // const [description, setDescription] = useState('');
    // const [category, setCategory] = useState('Otros'); // Valor por defecto
    // const [images, setImages] = useState('');
    // const [preferredItems, setPreferredItems] = useState('');

    //mensajes de estado
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Las categorías DEBEN coincidir con tu 'enum' del backend
    const categories = ['Electrónica', 'Libros', 'Servicios', 'Hogar', 'Otros'];

    useEffect(() => {
        const fetchArticle = async () => {
        try {
            setIsLoading(true);
            // Llamamos al endpoint de la API que ya creaste
            const response = await fetch(`https://trueque360.onrender.com/api/articles/${id}`);
            const data = await response.json();

            if (!response.ok) {
            throw new Error(data.message || 'No se pudo cargar el artículo');
            }
            setArticle(data.article);
            } catch (err) {
                // report user-friendly message in the same state field used by the form
                setMessage(err.message || 'Error al cargar el artículo');
        } finally {
            setIsLoading(false);
        }
        };

        fetchArticle();
    }, [id]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);
        
        const token = sessionStorage.getItem('token');
        if (!token) {
            setMessage('Error: No estás autenticado. Por favor, inicia sesión.');
            setIsLoading(false);
            return;
        }

        try {
            // Aquí Deberia de ir la logica para enviar los datos editados a traves de la API
        //Ahi les encargo que hagan esto no mamen

            setTimeout(() => {
                setIsLoading(false);
                setMessage('Artículo editado con éxito (simulado).');
                // Redirigir al detalle del artículo o al dashboard
                navigate('/dashboard');
            }, 2000);
        } catch (error) {
            setMessage(error.message);
            setIsLoading(false);
        }
    };

    return(
        <>
            <div className="edit-article-layout">
                <nav className="edit-article-nav">
                    <Link to="/dashboard">&larr; Volver al Dashboard</Link>
                    <h2>Editar Trueque</h2>
                </nav>

                <div className="edit-article-container">
                    <form className="edit-article-form" onSubmit={handleSubmit}>
                        
                        <div className="form-group">   
                            <label htmlFor="title">Título</label>
                            <input 
                                type="text" 
                                id="title"
                                value={article ? article.title : ''}
                                onChange={(e) => setArticle(prev => ({ ...(prev || {}), title: e.target.value }))}
                                placeholder="Ej: iPhone 12 casi nuevo" 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Descripción</label>
                            <textarea 
                                id="description"
                                value={article ? article.description : ''}
                                onChange={(e) => setArticle(prev => ({ ...(prev || {}), description: e.target.value }))}
                                placeholder="Describe tu artículo, su estado, etc." 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">Categoría</label>
                            <select id="category"
                                value={article ? article.category : 'Otros'}
                                onChange={(e) => setArticle(prev => ({ ...(prev || {}), category: e.target.value }))}
                            >
                                {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="images">URLs de Imágenes</label>
                            <input
                                type="text"
                                id="images"
                                value={article ? (Array.isArray(article.images) ? article.images.join(', ') : (article.images || '')) : ''}
                                onChange={(e) => setArticle(prev => ({ ...(prev || {}), images: e.target.value }))}
                                placeholder="Ej: https://example.com/imagen1.jpg, https://example.com/imagen2.jpg" 
                                required 
                            />
                            <small>Separar múltiples imágenes con una coma (,)</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="preferredItems">¿Qué buscas a cambio?</label>
                            <input 
                                type="text" 
                                id="preferredItems"
                                value={article ? (Array.isArray(article.preferredItems) ? article.preferredItems.join(', ') : (article.preferredItems || '')) : ''}
                                onChange={(e) => setArticle(prev => ({ ...(prev || {}), preferredItems: e.target.value }))}
                                placeholder="Ej: Laptop, Bicicleta, Libros" 
                            />
                            <small>Separar múltiples ítems con una coma (,)</small>
                        </div>

                        <button type="submit" className="submit-btn" disabled={isLoading}>
                            {isLoading ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                
                        {message && <p className="form-message">{message}</p>}
                    </form>
                </div>
            </div>
        </>
    );

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Componente de edición (versión de borrador)</h3>
      <p>Este archivo es un borrador y no debe usarse en producción. Usa <code>components/EditArticle/EditArticle.jsx</code> en su lugar.</p>
    </div>
  );

}

export default EditArticle;