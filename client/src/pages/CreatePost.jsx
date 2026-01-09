import Layout from "../components/Layout";
import { Link } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

const CreatePost = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold mb-2">Share Your Knowledge</h1>
            <p className="text-lg text-muted-foreground">Submit your post for admin review and publication</p>
          </div>
          
          <div className="rounded-xl bg-card text-card-foreground shadow border border-border">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="font-semibold tracking-tight text-2xl">Create New Post</div>
              <div className="text-sm text-muted-foreground">Fill in the information below</div>
            </div>
            
            <div className="p-6 pt-0">
              <form className="space-y-6">
                <div>
                  <label className="text-sm font-semibold block mb-2">Post Title</label>
                  <input 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-base" 
                    placeholder="Enter title..." 
                    value=""
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold block mb-2">Author</label>
                    <input 
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-base" 
                      placeholder="Your name..." 
                      value=""
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold block mb-2">Category</label>
                    <select className="w-full border border-input rounded-md px-3 py-2 text-base bg-background">
                      <option value="">Select category...</option>
                      <option value="Development">Development</option>
                      <option value="Design">Design</option>
                      <option value="Education">Education</option>
                      <option value="Career">Career</option>
                      <option value="Productivity">Productivity</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-semibold block mb-2">Post Content</label>
                  <textarea 
                    placeholder="Write your post content here..." 
                    rows="10" 
                    className="w-full border border-input rounded-md px-3 py-2 text-base font-sans resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  ></textarea>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <FontAwesomeIcon icon={faCircleInfo} className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Your post will be reviewed</p>
                    <p>Administrators will check the content before publishing. This may take a few hours.</p>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button 
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover-elevate active-elevate-2 bg-primary text-primary-foreground border border-primary-border min-h-10 rounded-md px-8 flex-1" 
                    type="submit"
                  >
                    Submit Post
                  </button>
                  <Link href="/blog">
                    <button 
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover-elevate active-elevate-2 border border-input shadow-xs active:shadow-none min-h-10 rounded-md px-8" 
                      type="button"
                    >
                      Back
                    </button>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePost;