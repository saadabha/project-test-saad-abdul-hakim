import './App.css'
import Navbar from './components/Navbar'
import Banner from './components/Banner'
import { useEffect, useState } from 'react'

function App() {
  const getInitialState = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      page: parseInt(params.get('page') || '1'),
      size: parseInt(params.get('size') || '10'),
      sort: params.get('sort') || '-published_at'
    };
  };
  
  const initialState = getInitialState();
  
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(initialState.page)
  const [size, setSize] = useState(initialState.size)
  const [sort, setSort] = useState(initialState.sort)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const [initialLoad, setInitialLoad] = useState(true)
  
  useEffect(() => {
    if (!initialLoad) {
      setPage(1);
    } else {
      setInitialLoad(false);
    }
  }, [size, sort, initialLoad]);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://suitmedia-backend.suitdev.com/api/ideas?page[number]=${page}&page[size]=${size}&append[]=small_image&append[]=medium_image&sort=${sort}`,
          {
            headers: {
              Accept: 'application/json',
            },
          }
        )

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        const data = await res.json()
        console.log('API response data:', data)

        if (!data || !data.data || !data.meta) {
          throw new Error('Data format unexpected')
        }

        setPosts(data.data)
        
        const calculatedTotalPages = Math.max(1, Math.ceil(data.meta.total / size));
        setTotalPages(calculatedTotalPages)
        setTotalItems(data.meta.total)
        
        if (page > calculatedTotalPages && calculatedTotalPages > 0) {
          setPage(calculatedTotalPages);
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
        setPosts([])
        setTotalItems(0)
        setTotalPages(1)
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts()
  }, [page, size, sort])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    const currentPage = params.get('page') || '';
    const currentSize = params.get('size') || '';
    const currentSort = params.get('sort') || '';
    
    if (page.toString() !== currentPage) params.set('page', page.toString());
    if (size.toString() !== currentSize) params.set('size', size.toString());
    if (sort !== currentSort) params.set('sort', sort);
    
    const url = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
    window.history.replaceState(null, '', url);
  }, [page, size, sort])

  return (
    <>
      <Navbar />
      <Banner
        imageUrl="banner.png"
        title="Ideas"
        subtitle="Where all our great things begin"
      />

      <main className="py-14 px-4 max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <span>
            {totalItems > 0 ? (
              `Showing ${(page - 1) * size + 1} - ${Math.min(page * size, totalItems)} of ${totalItems}`
            ) : (
              "No items to display"
            )}
          </span>
          <div className="flex gap-4 items-center">
            <label>
              Show per page:
              <select
                className="ml-2 border rounded px-2 py-1"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
              >
                {[10, 20, 50].map((val) => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </label>

            <label>
              Sort by:
              <select
                className="ml-2 border rounded px-2 py-1"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="-published_at">Newest</option>
                <option value="published_at">Oldest</option>
              </select>
            </label>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-10">
            <p>Loading...</p>
          </div>
        )}

        {!isLoading && posts.length === 0 && (
          <div className="text-center py-10 border rounded">
            <p className="text-gray-500">No items found</p>
          </div>
        )}

        {!isLoading && posts.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {posts.map((post: any) => (
              <div key={post.id} className="bg-white rounded shadow overflow-hidden">
                <img
                  src={post.small_image?.[0]?.url || 'placeholder.jpg'}
                  alt={post.title}
                  className="w-full aspect-[4/3] object-cover"
                  loading="lazy"
                  onError={(e) => {
                    if (!e.currentTarget.src.includes('via.placeholder.com')) {
                      e.currentTarget.src = 'placeholder.jpg'
                    }
                  }}
                />
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{new Date(post.published_at).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}</p>
                  <h2 className="text-sm font-semibold line-clamp-3">{post.title}</h2>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalItems > 0 && (
          <div className="mt-8 flex justify-center gap-1 flex-wrap text-sm">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1 || isLoading}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              &laquo;
            </button>

            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1 || isLoading}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              &lsaquo;
            </button>

            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= page - 1 && pageNumber <= page + 1) ||
                (page <= 3 && pageNumber <= 4) ||
                (page >= totalPages - 2 && pageNumber >= totalPages - 3)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    disabled={isLoading}
                    className={`px-3 py-1 rounded ${
                      page === pageNumber ? 'bg-orange-500 text-white' : 'bg-white border'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              }
              
              if (
                (pageNumber === 2 && page > 4) ||
                (pageNumber === totalPages - 1 && page < totalPages - 3)
              ) {
                return (
                  <span key={pageNumber} className="px-2 py-1 text-gray-400">
                    ...
                  </span>
                );
              }
              
              return null;
            })}

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages || isLoading}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              &rsaquo;
            </button>

            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages || isLoading}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              &raquo;
            </button>
          </div>
        )}
      </main>
    </>
  )
}

export default App