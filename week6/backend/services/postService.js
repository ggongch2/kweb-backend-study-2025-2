const postRepository = require('../repositories/postRepository');
const sanitizeHtml = require('sanitize-html');
const { HttpError } = require('../utils/error');

/**
 * Post Service
 * 게시글 관련 비즈니스 로직을 담당
 */

/**
 * 모든 게시글 조회
 */
async function getAllPosts() {
    // TODO: Implement
    return await postRepository.findAll() ; 
}

/**
 * 게시글 상세 조회
 */
async function getPostById(postId) {
    // TODO: Implement
    // postRepository.findById() 호출
    // 게시글이 없으면 적절한 에러 처리
    const post = await postRepository.findById(postId) ;
    if(!post) throw new HttpError("게시글이 없습니다.", 404) ; 
    return post ; 
}

/**
 * 게시글 작성
 */
async function createPost(title, content, userId) {
    // TODO: Implement
    // 1. 입력 유효성 검사
    if(content.trim() == ''|| title.trim() == '') 
        return new HttpError("제목 및 내용은 빈칸일수 없습니다", 400) ; 
    // 2. postRepository.create() 호출
    const createdpostId = await postRepository.create(sanitizeHtml(title), 
        sanitizeHtml(content), 
        sanitizeHtml(userId)
    ) ; 
    const post = await postRepository.findById(createdpostId) ;
    return post ; 
    // 3. 생성된 게시글 조회 및 반환
}

/**
 * 게시글 수정
 */
async function updatePost(postId, title, content, userId) {
    // TODO: Implement
    // 1. 입력 유효성 검사
    if(content.trim() == ''|| title.trim() == '') 
        return new HttpError("제목 및 내용은 빈칸일수 없습니다", 400) ; 

    // 2. 게시글 존재 확인
    await getPostById(postId) ; 
    // 3. 작성자 확인 (postRepository.isOwner)
    const correspondence = await postRepository.isOwner(postId, userId) ; 
    if(!correspondence) 
        throw new HttpError("자신의 글만 수정할 수 있습니다", 403) ;
    // 4. postRepository.update() 호출
    const updatePost = await postRepository.update(postId, title, content) ;
    if(!updatePost) 
        throw new HttpError('수정 실패', 500) ;
    // 5. 수정된 게시글 조회 및 반환
    return updatePost ; 
}

/**
 * 게시글 삭제
 */
async function deletePost(postId, userId) {
    // TODO: Implement
    // 1. 게시글 존재 확인
    await getPostById(postId) ; 

    // 2. 작성자 확인 (postRepository.isOwner)
    const correspondence = await postRepository.isOwner(postId, userId) ; 
    if(!correspondence) 
        throw new HttpError("자신의 글만 삭제할 수 있습니다", 403) ;
    // 3. postRepository.deleteById() 호출
    return await postRepository.deleteById(postId) ; 

}

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
};
