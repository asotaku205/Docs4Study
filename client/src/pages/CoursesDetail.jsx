import React, { useState, useEffect } from "react";
import { useRoute } from "wouter";
import Layout from "../components/Layout";
import BackgroundPhoto from "../components/users/BackgroundPhoto";
import BackButton from "../components/ui/BackButton";
import CommentSection from "../components/users/CommentSection";
import ContentHeader from "../components/users/shared/ContentHeader";
import SidebarInfo from "../components/users/shared/SidebarInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink, faClock } from "@fortawesome/free-solid-svg-icons";
import apiUser from "@/services/apiUser";
import { useLanguage } from "../i18n/LanguageContext";

const CoursesDetail = () => {
  const [, params] = useRoute("/courses-detail/:id");
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (params?.id) {
      fetchCourseDetail();
    }
  }, [params?.id]);

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      const response = await apiUser.get(`/user/courses/${params.id}`);
      setCourse(response.data);
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (content) => {
    try {
      setSubmittingComment(true);
      await apiUser.post(`/user/courses/${params.id}/comments`, { content });
      await fetchCourseDetail(); // Làm mới để lấy bình luận mới
    } catch (error) {
      console.error("Error adding comment:", error);
      const errorMessage = error.response?.data?.message || t.alerts.commentFailed;
      alert(errorMessage);
      
      // Nếu 401/403, chuyển hướng đến trang đăng nhập
      if (error.response?.status === 401 || error.response?.status === 403) {
        window.location.href = '/auth';
      }
      throw error;
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p>{t.courseDetail.loading}</p>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p>{t.courseDetail.notFound}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <BackgroundPhoto image="/library.png" />
      <div className="container mx-auto px-4 -mt-32 relative z-10 max-w-5xl">
        <BackButton 
          link="/courses"
          text={t.nav.courses}
        />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ContentHeader
              category={course.category}
              title={course.title}
              description={course.description || t.courseDetail.descriptionFallback}
              showAuthor={false}
            >
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} />{" "}
                  <span className="font-semibold">{course.duration || t.courseDetail.selfPaced}</span>
                </div>
                <div className="px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {course.level || t.courseDetail.beginner}
                </div>
              </div>
            </ContentHeader>
            <div className="bg-card rounded-2xl p-8">
              <h2 className="text-2xl font-bold font-heading mb-6">
                {t.courseDetail.accessCourse}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t.courseDetail.accessDescription}
              </p>
              <a 
                href={course.courseUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                <FontAwesomeIcon icon={faExternalLink} />
                {t.courseDetail.goToCourse}
              </a>
            </div>
          </div>
          <div className="lg:col-span-1">
            <SidebarInfo className="overflow-hidden">
              <div className="h-40 rounded-lg overflow-hidden mb-6">
                <img
                  alt={course.title}
                  className="w-full h-full object-cover"
                  src={course.thumbnail || "/library.png"}
                />
              </div>
              <a 
                href={course.courseUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover-elevate active-elevate-2 bg-primary text-primary-foreground border border-primary-border min-h-9 px-4 py-2 w-full mb-3 gap-2 h-12 font-semibold"
              >
                {t.courseDetail.accessCourse}
                <FontAwesomeIcon icon={faExternalLink} />
              </a>
              <div className="mt-6 pt-6 border-t border-border space-y-3 text-sm">
                <p className="text-muted-foreground">
                  <strong>{t.courseDetail.difficulty}:</strong> {course.level || t.courseDetail.beginner}
                </p>
                <p className="text-muted-foreground">
                  <strong>{t.courseDetail.duration}:</strong> {course.duration || t.courseDetail.selfPaced}
                </p>
              </div>
            </SidebarInfo>
          </div>
        </div>
        <CommentSection 
          comments={course.comments || []}
          onCommentSubmit={handleCommentSubmit}
          submitting={submittingComment}
        />
      </div>
    </Layout>
  );
};
export default CoursesDetail;