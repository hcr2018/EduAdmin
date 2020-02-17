/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const bookRouter = {
    path: '/book',
    component: Layout,
    redirect: 'noRedirect',
    name: 'bookResearch',
    meta: { title: 'bookResearch', icon: "book" },
    children: [
        {
            path: 'list',
            component: () => import('@/views/course/bookList'),
            name: 'bookList',
            meta: { title: 'bookList', icon: 'documentation' }
        },
        {
            path: 'bookAdpter',
            component: () => import('@/views/course/addChapter'),
            name: 'bookAdpter',
            hidden: true,
            meta: { title: 'bookAdpter', icon: "book" }
        },
        // {

        //     path: 'questionsList',
        //     name: 'questionsList',
        //     meta: {
        //         title: 'questionsList',
        //     },
        //     component: () => import('@/views/course/question/questionsList'),
        // },
        {

            path: 'chapterExercise',
            name: 'chapterExercise',
            meta: {
                title: 'chapterExercise', icon: "exam1"
            },
            component: () => import('@/views/course/question/chapterExercises'),
        },
        {

            path: 'mockExam',
            name: 'mockExam',
            meta: {
                title: 'mockExam', icon: "exam2"
            },
            component: () => import('@/views/course/question/mockExam'),
        },
        {

            path: 'highFrequency',
            name: 'highFrequency',
            meta: {
                title: 'highFrequency', icon: "exam3"
            },
            component: () => import('@/views/course/question/highFrequencyExam'),
        },
        {
            path: 'svipExam',
            name: 'svipExam',
            meta: {
                title: 'svipExam', icon: "exam4"
            },
            component: () => import('@/views/course/question/svipExam'),
        },
        // {

        //     path: 'taskExam',
        //     name: 'taskExam',
        //     meta: {
        //         title: 'taskExam',
        //     },
        //     component: () => import('@/views/course/question/taskExam'),
        // },
        {

            path: 'achievementAnalysis',
            name: 'achievementAnalysis',
            meta: {
                title: 'achievementAnalysis', icon: "exam6"
            },
            component: () => import('@/views/course/question/achievementAnalysis'),
        }
    ]
}
export default bookRouter
