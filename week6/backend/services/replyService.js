const replyRepository = require('../repositories/replyRepository');
const postRepository = require('../repositories/postRepository');
const sanitizeHtml = require('sanitize-html');
const { HttpError } = require('../utils/error');
/**
 * Reply Service
 * 댓글 관련 비즈니스 로직을 담당
 */

/**
 * 특정 게시글의 댓글 목록 조회
 */
async function getRepliesByPostId(postId) {
    // TODO: Implement
    // 1. 게시글 존재 확인 (postRepository.findById)
    const post = await postRepository.findById(postId) ;
    if(!post) 
        throw new HttpError("게시글이 존재하지 않습니다", 404) ;
    // 2. replyRepository.findByPostId() 호출
    const rows = await replyRepository.findByPostId(postId) ; 
    return rows ; 
}

/**
 * 댓글 작성
 */
async function createReply(content, postId, userId) {
    // TODO: Implement
    // 1. 입력 유효성 검사
    if(content.trim()=='')
        throw new HttpError('내용은 빈칸 X', 403) ;
    // 2. 게시글 존재 확인 (postRepository.findById)
    const post = await postRepository.findById(postId) ;
    if(!post) 
        throw new HttpError("게시글이 존재하지 않습니다", 404) ;
    // 3. replyRepository.create() 호출
    const createdId = await replyRepository.create(
        sanitizeHtml(content), postId, userId
    ) ;
    // 4. 생성된 댓글 조회 및 반환
    const reply = await replyRepository.findById(createdId) ; 
    return reply ; 
}

/**
 * 댓글 삭제
 */
async function deleteReply(replyId, userId) {
    // TODO: Implement
    // 1. 댓글 존재 확인 (replyRepository.findById)
    const reply = await replyRepository.findById(replyId) ;
    if(!reply)
        throw new HttpError('댓글이 존재하지 않습니다', 404) ; 
    // 2. 작성자 확인 (replyRepository.isOwner)
    if(!await replyRepository.isOwner(replyId, userId))
        throw new HttpError('자신의 댓글만 삭제 가능', 401) ;
    // 3. replyRepository.deleteById() 호출
    return await replyRepository.deleteById(replyId) ;
}

module.exports = {
    getRepliesByPostId,
    createReply,
    deleteReply
};
