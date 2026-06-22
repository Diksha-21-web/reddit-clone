

// Global Application State
let posts = [];
let users = [];
let currentUser = null;
let activePostId = null;
let activeSort = 'best';
let activeView = 'card';

// Initial Mock Data
const defaultPosts = [
    {
        id: 5, // ID determines 'new' sorting. Higher is newer.
        subreddit: "r/trekkingIndia",
        author: "u/Happy-Unit8697",
        title: "Flawless",
        body: "",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        imageUrl: "",
        upvotes: 34,
        userVote: null,
        comments: [
            {
                author: "u/mountain_lover",
                text: "Wow, which peak is this?",
                time: "2 days ago"
            },
            {
                author: "u/trekker123",
                text: "The clouds look amazing. Great shot!",
                time: "1 day ago"
            },
            {
                author: "u/hiker_dude",
                text: "Is this near the Himalayas?",
                time: "5 hours ago"
            },
            {
                author: "u/nature_fanatic",
                text: "Incredible view! Added to my bucket list.",
                time: "3 hours ago"
            },
            {
                author: "u/wanderlust99",
                text: "Flawless indeed.",
                time: "1 hour ago"
            },
            {
                author: "u/cloud_chaser",
                text: "Beautiful weather for a trek.",
                time: "Just now"
            }
        ]
    },
    {
        id: 4,
        subreddit: "r/webdev",
        author: "u/front_end_wizard",
        title: "I spent 3 weeks building this responsive Reddit clone from scratch using HTML, Bootstrap 5 and jQuery. Feedback welcomed!",
        body: "Hey guys! I wanted to practice my frontend styling and jQuery scripting by building a fully responsive, highly interactive Reddit clone. It features a working client-side vote persistence system, dynamic post creation, real-time input validation, dark mode toggle, and single-post comment lists. What do you think?",
        imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=60",
        upvotes: 342,
        userVote: null,
        comments: [
            {
                author: "u/css_ninja",
                text: "Wow! The layout is super clean. That dark mode transitions looks incredibly smooth. Good job on using native CSS variables for the color tokens!",
                time: "2 hours ago"
            },
            {
                author: "u/bootstrap_fan",
                text: "Nice grid responsiveness. Works perfectly on my iPhone 13 in Safari. Keep up the awesome work!",
                time: "1 hour ago"
            }
        ]
    },
    {
        id: 3,
        subreddit: "r/javascript",
        author: "u/callback_hell",
        title: "Why jQuery is still useful in 2026 for rapid prototyping and simple web applications",
        body: "I know everyone is learning React/Next.js nowadays, but there's something so satisfying about using simple DOM manipulation tools. jQuery allows you to add features like validation, event handling, AJAX loading, and animations in just a few lines without any build tools. What are your thoughts on this?",
        imageUrl: "",
        upvotes: 184,
        userVote: "up",
        comments: [
            {
                author: "u/vanilla_purest",
                text: "I agree, especially for projects where you don't need complex state management. jQuery is light and reliable.",
                time: "5 hours ago"
            }
        ]
    },
    {
        id: 2,
        subreddit: "r/gaming",
        author: "u/pixel_adventurer",
        title: "Rate my setup! Upgraded just in time for the summer gaming marathon.",
        body: "After saving up for almost a year, I finally finished my dual-monitor battlestation. It's powered by an RTX 4080 and a Ryzen 7. Custom cable management took me almost 4 hours but it was totally worth it.",
        imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=60",
        upvotes: 512,
        userVote: null,
        comments: [
            {
                author: "u/rgb_lord",
                text: "Very neat! The white/grey color scheme looks very modern and clean. Love the neon backlight.",
                time: "8 hours ago"
            },
            {
                author: "u/console_pleb",
                text: "My cable management is basically a rat's nest behind my desk. Major props to you for keeping it that clean!",
                time: "7 hours ago"
            }
        ]
    },
    {
        id: 1,
        subreddit: "r/askreddit",
        author: "u/curious_mind",
        title: "What is a small habit that completely changed your daily productivity and mental health?",
        body: "Looking for simple routines that don't take more than 10-15 minutes, but have made a noticeable difference in your mood, energy levels, or workflow during the day.",
        imageUrl: "",
        upvotes: 95,
        userVote: "down",
        comments: [
            {
                author: "u/morning_runner",
                text: "Leaving my phone in the kitchen overnight. I read a book for 15 minutes before sleeping and don't look at social media until after breakfast. Game changer.",
                time: "12 hours ago"
            },
            {
                author: "u/hydrated_dev",
                text: "Drinking a large glass of cold water immediately after waking up. It clears the brain fog faster than coffee.",
                time: "10 hours ago"
            }
        ]
    }
];

// Initialize Application
$(document).ready(function() {
    initTheme();
    loadAuth();
    loadPosts();
    renderFeed(posts);
    setupEventListeners();
});

// Load Theme preference
function initTheme() {
    const savedTheme = localStorage.getItem('reddit_clone_theme');
    if (savedTheme === 'dark') {
        $('body').addClass('dark-mode');
        $('#theme-toggle').html('<i class="fa-solid fa-sun text-warning"></i>');
    } else {
        $('body').removeClass('dark-mode');
        $('#theme-toggle').html('<i class="fa-solid fa-moon"></i>');
    }
}

// Load Auth States
function loadAuth() {
    // Registered Users
    const savedUsers = localStorage.getItem('reddit_clone_registered_users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    } else {
        // Default Mock User
        users = [
            { username: "Janardhan", email: "janardhan@example.com", password: "password123" }
        ];
        localStorage.setItem('reddit_clone_registered_users', JSON.stringify(users));
    }

    // Session user
    const savedCurrentUser = localStorage.getItem('reddit_clone_current_user');
    if (savedCurrentUser) {
        currentUser = JSON.parse(savedCurrentUser);
    }
    updateAuthNavbar();
}

// Update UI navbar based on logged in/out state
function updateAuthNavbar() {
    if (currentUser) {
        // Logged In
        $('#nav-guest-actions').addClass('d-none').removeClass('d-flex');
        $('#nav-user-actions').removeClass('d-none').addClass('d-flex');
        $('#nav-username').text(`u/${currentUser.username}`);
        $('#quick-create-post-card').attr('data-bs-toggle', 'modal').attr('data-bs-target', '#createPostModal');
    } else {
        // Guest
        $('#nav-user-actions').addClass('d-none').removeClass('d-flex');
        $('#nav-guest-actions').removeClass('d-none').addClass('d-flex');
        $('#quick-create-post-card').removeAttr('data-bs-toggle').removeAttr('data-bs-target');
    }
}

// Action guard helper - returns true if logged in, otherwise prompts auth
function checkAuthGuard() {
    if (!currentUser) {
        // Open Auth modal with Login active tab
        const modalEl = document.getElementById('authModal');
        const modalInstance = new bootstrap.Modal(modalEl);
        
        // Show login panel by default
        const tabEl = document.querySelector('#login-tab');
        bootstrap.Tab.getInstance(tabEl)?.show() || new bootstrap.Tab(tabEl).show();
        
        modalInstance.show();
        return false;
    }
    return true;
}

// Load Posts state from LocalStorage or use defaults
function loadPosts() {
    const savedPosts = localStorage.getItem('reddit_clone_posts');
    if (savedPosts) {
        try {
            posts = JSON.parse(savedPosts);
            if (posts.length === 0) {
                // If it exists but is empty, reset to defaults to avoid empty feed
                posts = [...defaultPosts];
                savePosts();
            }
        } catch (e) {
            posts = [...defaultPosts];
            savePosts();
        }
    } else {
        posts = [...defaultPosts];
        savePosts();
    }
}

// Save current state to local storage
function savePosts() {
    localStorage.setItem('reddit_clone_posts', JSON.stringify(posts));
}

// Render the main feed list
function renderFeed(postsToRender) {
    const $container = $('#feed-container');
    $container.empty();

    if (postsToRender.length === 0) {
        $container.append(`
            <div class="card p-5 text-center post-card">
                <i class="fa-regular fa-face-frown fa-3x text-muted mb-3"></i>
                <h5>No posts found</h5>
                <p class="text-muted">Try looking for something else or create a new post!</p>
            </div>
        `);
        return;
    }

    // Apply Sorting logic
    let sortedPosts = [...postsToRender];
    if (activeSort === 'new') {
        // Sort by ID descending (newest timestamp first)
        sortedPosts.sort((a, b) => b.id - a.id);
    } else if (activeSort === 'top') {
        // Sort by upvotes descending
        sortedPosts.sort((a, b) => b.upvotes - a.upvotes);
    } else if (activeSort === 'rising') {
        // Pseudo logic: sort by comment count for rising mock effect
        sortedPosts.sort((a, b) => b.comments.length - a.comments.length);
    }
    // 'best' and 'hot' keep original mock order

    sortedPosts.forEach(function(post) {
        const cardHtml = createPostCardHtml(post, false);
        $container.append(cardHtml);
    });
}

// Helper to generate HTML structure for a single post card
function createPostCardHtml(post, isDetailView = false) {
    // Determine voting state classes
    let upVoteClass = post.userVote === 'up' ? 'active text-danger' : '';
    let downVoteClass = post.userVote === 'down' ? 'active text-primary' : '';
    let countClass = '';
    
    if (post.userVote === 'up') countClass = 'upvoted';
    if (post.userVote === 'down') countClass = 'downvoted';

    // View Mode classes
    let viewClass = '';
    if (!isDetailView && activeView === 'compact') {
        viewClass = 'compact';
    }

    // Render media if present (Hidden by CSS in compact mode)
    let mediaHtml = '';
    if (post.videoUrl) {
        mediaHtml = `
        <div class="post-image-container" style="background-color: black;">
            <video src="${post.videoUrl}" class="post-image" controls muted loop style="max-height: 450px; width: 100%; object-fit: contain;"></video>
        </div>
        `;
    } else if (post.imageUrl) {
        mediaHtml = `
        <div class="post-image-container">
            <img src="${post.imageUrl}" class="post-image" alt="Post attachment" onerror="this.parentElement.style.display='none'">
        </div>
        `;
    }

    // Render body preview if present
    let bodyHtml = '';
    if (post.body) {
        if (isDetailView) {
            bodyHtml = `<div class="post-detail-text">${post.body}</div>`;
        } else {
            bodyHtml = `<div class="post-body-preview">${post.body}</div>`;
        }
    }

    // Wrap elements to navigate to details if in feed list
    const titleAttr = isDetailView ? '' : `data-post-id="${post.id}"`;
    const cursorClass = isDetailView ? '' : 'post-clickable';

    return `
        <div class="card post-card mb-3 ${viewClass}" data-id="${post.id}">
            <!-- Vote Column -->
            <div class="vote-column">
                <button class="vote-btn upvote ${upVoteClass}" title="Upvote">
                    <i class="fa-solid fa-arrow-up"></i>
                </button>
                <div class="vote-count ${countClass}">${post.upvotes}</div>
                <button class="vote-btn downvote ${downVoteClass}" title="Downvote">
                    <i class="fa-solid fa-arrow-down"></i>
                </button>
            </div>
            
            <!-- Post Content -->
            <div class="post-content ${cursorClass}" ${titleAttr}>
                <div class="post-meta">
                    <a href="#" class="subreddit-badge">${post.subreddit}</a>
                    <span class="d-none d-sm-inline">•</span>
                    <span class="d-none d-sm-inline">Posted by ${post.author}</span>
                </div>
                
                <h5 class="post-title">${post.title}</h5>
                
                ${bodyHtml}
                ${mediaHtml}
                
                <div class="post-actions">
                    <button class="action-btn comment-btn">
                        <i class="fa-regular fa-comment"></i>
                        <span>${post.comments.length} <span class="d-none d-sm-inline">Comments</span></span>
                    </button>
                    <button class="action-btn share-btn">
                        <i class="fa-regular fa-share-from-square"></i>
                        <span class="d-none d-sm-inline">Share</span>
                    </button>
                    <button class="action-btn save-btn">
                        <i class="${post.saved ? 'fa-solid fa-bookmark text-primary' : 'fa-regular fa-bookmark'}"></i>
                        ${post.saved ? '<span class="d-none d-sm-inline text-primary">Saved</span>' : '<span class="d-none d-sm-inline">Save</span>'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Render the details page of a single post
function renderPostDetail(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    activePostId = postId;
    
    // Render detail card
    const $detailContainer = $('#post-detail-container');
    $detailContainer.empty();
    $detailContainer.append(createPostCardHtml(post, true));

    // Render Comments List
    renderComments(post.comments);

    // Swap Views
    $('#feed-view').hide();
    $('#post-detail-view').fadeIn(200);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Render comments list under the active post detail
function renderComments(comments) {
    const $list = $('#comments-list');
    $list.empty();

    if (comments.length === 0) {
        $list.append(`
            <div class="text-center py-4 text-muted" id="no-comments-prompt">
                <i class="fa-regular fa-comments fa-2xl mb-2"></i>
                <p class="small">No comments yet. Be the first to share what you think!</p>
            </div>
        `);
        return;
    }

    comments.forEach(function(comment) {
        $list.append(`
            <div class="comment-item">
                <div class="comment-meta">
                    <span class="comment-author">${comment.author}</span>
                    <span>•</span>
                    <span>${comment.time}</span>
                </div>
                <div class="comment-text">${comment.text}</div>
            </div>
        `);
    });
}

// Setup jQuery Event Handlers
function setupEventListeners() {
    
    // Upvote / Downvote Logic
    $(document).on('click', '.vote-btn', function(e) {
        e.stopPropagation(); // Prevent post details navigation
        
        // Guard check: User must be logged in to vote
        if (!checkAuthGuard()) return;

        const $btn = $(this);
        const $card = $btn.closest('.post-card');
        const postId = parseInt($card.data('id'));
        const post = posts.find(p => p.id === postId);
        
        if (!post) return;

        const isUpvote = $btn.hasClass('upvote');
        
        if (isUpvote) {
            if (post.userVote === 'up') {
                // Undo upvote
                post.userVote = null;
                post.upvotes -= 1;
            } else if (post.userVote === 'down') {
                // Change down to up
                post.userVote = 'up';
                post.upvotes += 2;
            } else {
                // Add upvote
                post.userVote = 'up';
                post.upvotes += 1;
            }
        } else {
            // Downvote
            if (post.userVote === 'down') {
                // Undo downvote
                post.userVote = null;
                post.upvotes += 1;
            } else if (post.userVote === 'up') {
                // Change up to down
                post.userVote = 'down';
                post.upvotes -= 2;
            } else {
                // Add downvote
                post.userVote = 'down';
                post.upvotes -= 1;
            }
        }

        // Save State
        savePosts();

        // Update vote layout elements on the specific card immediately for smooth performance
        const $voteCol = $card.find('.vote-column');
        const $upBtn = $voteCol.find('.upvote');
        const $downBtn = $voteCol.find('.downvote');
        const $count = $voteCol.find('.vote-count');

        // Reset classes
        $upBtn.removeClass('active text-danger');
        $downBtn.removeClass('active text-primary');
        $count.removeClass('upvoted downvoted');

        // Apply new classes
        $count.text(post.upvotes);
        if (post.userVote === 'up') {
            $upBtn.addClass('active text-danger');
            $count.addClass('upvoted');
        } else if (post.userVote === 'down') {
            $downBtn.addClass('active text-primary');
            $count.addClass('downvoted');
        }
        
        // If we are currently looking at the detail view, sync that card too
        if (activePostId === postId && $('#post-detail-view').is(':visible')) {
            renderPostDetail(postId);
        }
    });

    // Navigate to Single Post details
    $(document).on('click', '.post-clickable', function() {
        const postId = parseInt($(this).data('post-id'));
        renderPostDetail(postId);
    });

    // Comment Button Click (navigates to details too)
    $(document).on('click', '.comment-btn', function(e) {
        e.stopPropagation();
        const postId = parseInt($(this).closest('.post-card').data('id'));
        renderPostDetail(postId);
    });

    // Share Button Click
    $(document).on('click', '.share-btn', function(e) {
        e.stopPropagation();
        const $btn = $(this);
        const originalHtml = $btn.html();
        
        // Temporarily show "Copied!" state
        $btn.html('<i class="fa-solid fa-check text-success"></i> <span class="d-none d-sm-inline text-success fw-bold">Copied!</span>');
        
        // Reset after 2 seconds
        setTimeout(() => {
            $btn.html(originalHtml);
        }, 2000);
    });

    // Save Button Click
    $(document).on('click', '.save-btn', function(e) {
        e.stopPropagation();
        if (!checkAuthGuard()) return;

        const $btn = $(this);
        const $card = $btn.closest('.post-card');
        const postId = parseInt($card.data('id'));
        const post = posts.find(p => p.id === postId);
        
        if (!post) return;

        // Toggle saved state
        post.saved = !post.saved;
        savePosts();

        // Update UI immediately
        if (post.saved) {
            $btn.html('<i class="fa-solid fa-bookmark text-primary"></i> <span class="d-none d-sm-inline text-primary">Saved</span>');
        } else {
            $btn.html('<i class="fa-regular fa-bookmark"></i> <span class="d-none d-sm-inline">Save</span>');
        }
        
        // Also update the detail view if it's currently open for the same post
        if (activePostId === postId && $('#post-detail-view').is(':visible') && !$card.parent().is('#post-detail-container')) {
             renderPostDetail(postId);
        }
    });

    // Go Back to Feed View
    $('#back-to-feed-btn, #nav-brand-logo').click(function(e) {
        e.preventDefault();
        activePostId = null;
        $('#post-detail-view').hide();
        $('#feed-view').fadeIn(200);
        renderFeed(posts); // Refresh votes/comments count
    });

    // Quick create card handler
    $('#quick-create-post-card').click(function() {
        if (!checkAuthGuard()) return;
        const modalEl = document.getElementById('createPostModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modalInstance.show();
    });

    // Sidebar create post button handler
    $('#sidebar-create-post-btn').click(function() {
        if (!checkAuthGuard()) return;
        const modalEl = document.getElementById('createPostModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modalInstance.show();
    });

    // Form Submission: Create Post Validation & Action
    $('#submit-post-btn').click(function() {
        if (!checkAuthGuard()) return;

        const titleInput = $('#post-title');
        const titleVal = titleInput.val().trim();
        const bodyVal = $('#post-body').val().trim();
        const mediaUrlVal = $('#post-media-url').val().trim();
        const subredditVal = $('#post-subreddit').val();

        let isVideo = false;
        if (mediaUrlVal.toLowerCase().endsWith('.mp4') || mediaUrlVal.toLowerCase().endsWith('.webm') || mediaUrlVal.toLowerCase().endsWith('.ogg')) {
            isVideo = true;
        }

        // Validation: Title required
        if (titleVal === '') {
            titleInput.addClass('is-invalid');
            $('#title-error').fadeIn();
            return;
        } else {
            titleInput.removeClass('is-invalid');
            $('#title-error').hide();
        }

        // Create new post
        const newPost = {
            id: Date.now(),
            subreddit: subredditVal,
            author: `u/${currentUser.username}`,
            title: titleVal,
            body: bodyVal,
            imageUrl: isVideo ? "" : mediaUrlVal,
            videoUrl: isVideo ? mediaUrlVal : "",
            upvotes: 1,
            userVote: 'up', // Author automatically upvotes their post
            saved: false,
            comments: []
        };

        // Add to state and save
        posts.unshift(newPost);
        savePosts();

        // Close Modal
        const modalEl = document.getElementById('createPostModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        modalInstance.hide();

        // Reset Form Fields
        $('#create-post-form')[0].reset();

        // Change sort to New so the new post appears at the top
        activeSort = 'new';
        $('#current-sort-label').text('New');
        $('.sort-option').removeClass('active');
        $('.sort-option[data-sort="new"]').addClass('active');

        // Re-render feed and highlight new post with fade down animation
        renderFeed(posts);

        // Add animation to the newly added post card
        const $newCard = $('#feed-container').children().first();
        $newCard.addClass('new-post-anim');
        
        // Remove helper class after transition finishes
        setTimeout(() => {
            $newCard.removeClass('new-post-anim');
        }, 500);

        // Scroll to top to see newly created post
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Input listener to clear validation errors when writing
    $('#post-title').on('input', function() {
        if ($(this).val().trim() !== '') {
            $(this).removeClass('is-invalid');
            $('#title-error').hide();
        }
    });

    // Add Comment Logic
    $('#comment-form').submit(function(e) {
        e.preventDefault();
        
        if (!checkAuthGuard()) return;

        const $input = $('#comment-text');
        const textVal = $input.val().trim();
        if (textVal === '' || activePostId === null) return;

        const post = posts.find(p => p.id === activePostId);
        if (!post) return;

        // Create new comment object
        const newComment = {
            author: `u/${currentUser.username}`,
            text: textVal,
            time: "Just now"
        };

        // Add comment and save
        post.comments.push(newComment);
        savePosts();

        // Re-render comments container
        renderComments(post.comments);
        
        // Clear text field
        $input.val('');

        // Dynamically update comments action count on post card
        const commentText = post.comments.length === 1 ? '1 Comment' : `${post.comments.length} Comments`;
        $('#post-detail-container').find('.comment-btn span').text(commentText);
    });

    // Search Posts Logic (Real-time filter)
    $('#search-posts').on('input', function() {
        const query = $(this).val().toLowerCase().trim();
        
        // If query is empty, render all posts
        if (query === '') {
            renderFeed(posts);
            return;
        }

        // Filter based on Title, Body, or Subreddit Name
        const filteredPosts = posts.filter(function(post) {
            return post.title.toLowerCase().includes(query) || 
                   (post.body && post.body.toLowerCase().includes(query)) ||
                   post.subreddit.toLowerCase().includes(query);
        });

        renderFeed(filteredPosts);
    });

    // Dark Mode Theme Toggle Click
    $('#theme-toggle').click(function() {
        const isDarkMode = $('body').toggleClass('dark-mode').hasClass('dark-mode');
        
        if (isDarkMode) {
            localStorage.setItem('reddit_clone_theme', 'dark');
            $(this).html('<i class="fa-solid fa-sun text-warning"></i>');
        } else {
            localStorage.setItem('reddit_clone_theme', 'light');
            $(this).html('<i class="fa-solid fa-moon"></i>');
        }
    });

    // Sort Dropdown Change logic
    $('.sort-option').click(function(e) {
        e.preventDefault();
        const sortType = $(this).data('sort');
        const sortLabel = $(this).text();
        
        // Update states
        activeSort = sortType;
        
        // Update UI
        $('.sort-option').removeClass('active');
        $(this).addClass('active');
        
        // Render
        renderFeed(posts);
    });

    // View Layout Dropdown logic
    $('.view-option').click(function(e) {
        e.preventDefault();
        const viewType = $(this).data('view');
        
        // Update states
        activeView = viewType;
        
        // Update UI
        $('.view-option').removeClass('active');
        $(this).addClass('active');
        
        // Change toggle button icon
        if (viewType === 'card') {
            $('#view-icon').attr('class', 'fa-solid fa-window-maximize');
            $('#view-label').text('Card');
        } else {
            $('#view-icon').attr('class', 'fa-solid fa-bars');
            $('#view-label').text('Compact');
        }
        
        // Render
        renderFeed(posts);
    });

    // Mobile Sidebar Drawer Toggles
    $('#mobile-sidebar-toggle').click(function() {
        $('#left-sidebar').addClass('show');
        $('#sidebar-backdrop').addClass('show');
        $('body').css('overflow', 'hidden'); // Prevent background scrolling
    });

    $('#sidebar-backdrop').click(function() {
        $('#left-sidebar').removeClass('show');
        $('#sidebar-backdrop').removeClass('show');
        $('body').css('overflow', '');
    });

    // Reset All Application Data handler
    $('#reset-data-btn').click(function() {
        if (confirm("Are you sure you want to reset all data to default mock posts and log out?")) {
            localStorage.removeItem('reddit_clone_posts');
            localStorage.removeItem('reddit_clone_current_user');
            // Retain users registry but reset session
            currentUser = null;
            
            // Reload default states
            posts = [...defaultPosts];
            savePosts();
            
            // Reset filters to defaults
            activeSort = 'best';
            $('.sort-option').removeClass('active');
            $('.sort-option[data-sort="best"]').addClass('active');

            activeView = 'card';
            $('#view-icon').attr('class', 'fa-solid fa-window-maximize');
            $('#view-label').text('Card');
            $('.view-option').removeClass('active');
            $('.view-option[data-view="card"]').addClass('active');

            // UI updates
            updateAuthNavbar();
            $('#post-detail-view').hide();
            $('#feed-view').show();
            renderFeed(posts);
            
            alert("App data reset successfully!");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // Authentication Actions & Nav Switchers
    $('[data-bs-toggle="modal"][data-bs-target="#authModal"]').click(function() {
        const targetTab = $(this).attr('data-tab'); // 'login' or 'signup'
        
        // Timeout to ensure modal has initialized
        setTimeout(() => {
            const tabEl = document.querySelector(`#${targetTab}-tab`);
            if (tabEl) {
                const tab = bootstrap.Tab.getInstance(tabEl) || new bootstrap.Tab(tabEl);
                tab.show();
            }
        }, 150);
    });

    // Submitting Login Form
    $('#login-form').submit(function(e) {
        e.preventDefault();
        
        const usernameVal = $('#login-username').val().trim();
        const passwordVal = $('#login-password').val().trim();
        const $errorMsg = $('#login-error-msg');

        // Check credentials against registered users list
        const matchedUser = users.find(u => 
            (u.username.toLowerCase() === usernameVal.toLowerCase() || u.email.toLowerCase() === usernameVal.toLowerCase()) && 
            u.password === passwordVal
        );

        if (matchedUser) {
            // Success
            $errorMsg.hide();
            currentUser = matchedUser;
            localStorage.setItem('reddit_clone_current_user', JSON.stringify(currentUser));
            
            // Update navbar state and hide modal
            updateAuthNavbar();
            
            const modalEl = document.getElementById('authModal');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            modalInstance.hide();
            
            // Reset form
            $('#login-form')[0].reset();
            
            // Sync current feeds/details to reflect auth
            if (activePostId !== null) {
                renderPostDetail(activePostId);
            } else {
                renderFeed(posts);
            }
        } else {
            // Failed
            $errorMsg.fadeIn();
        }
    });

    // Submitting Signup Form
    $('#signup-form').submit(function(e) {
        e.preventDefault();
        
        const usernameInput = $('#signup-username');
        const emailInput = $('#signup-email');
        const passwordInput = $('#signup-password');

        const usernameVal = usernameInput.val().trim();
        const emailVal = emailInput.val().trim();
        const passwordVal = passwordInput.val().trim();

        let isValid = true;

        // Reset errors
        $('.validation-error').hide();
        usernameInput.removeClass('is-invalid');
        emailInput.removeClass('is-invalid');
        passwordInput.removeClass('is-invalid');

        // Username validation (min 3 characters, alphanumeric)
        const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
        if (!usernameRegex.test(usernameVal)) {
            usernameInput.addClass('is-invalid');
            $('#signup-username-error').text("Username must be at least 3 characters (alphanumeric/underscores)").fadeIn();
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailVal)) {
            emailInput.addClass('is-invalid');
            $('#signup-email-error').fadeIn();
            isValid = false;
        }

        // Password validation (10 chars, 1 uppercase, 1 special character)
        const passwordRegex = /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{10}$/;
        if (!passwordRegex.test(passwordVal)) {
            passwordInput.addClass('is-invalid');
            $('#signup-password-error').fadeIn();
            isValid = false;
        }

        // Check if username already exists
        const exists = users.some(u => u.username.toLowerCase() === usernameVal.toLowerCase());
        if (exists) {
            usernameInput.addClass('is-invalid');
            $('#signup-username-error').text("Username is already taken!").fadeIn();
            isValid = false;
        }

        if (!isValid) return;

        // Add user to state and log in
        const newUser = {
            username: usernameVal,
            email: emailVal,
            password: passwordVal
        };

        users.push(newUser);
        localStorage.setItem('reddit_clone_registered_users', JSON.stringify(users));

        currentUser = newUser;
        localStorage.setItem('reddit_clone_current_user', JSON.stringify(currentUser));

        // Update UI
        updateAuthNavbar();

        // Close Modal
        const modalEl = document.getElementById('authModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        modalInstance.hide();

        // Reset form
        $('#signup-form')[0].reset();

        // Sync feed
        if (activePostId !== null) {
            renderPostDetail(activePostId);
        } else {
            renderFeed(posts);
        }
    });

    // Logout click handler
    $('#nav-logout-btn').click(function(e) {
        e.preventDefault();
        currentUser = null;
        localStorage.removeItem('reddit_clone_current_user');
        
        updateAuthNavbar();
        
        // Sync feed / post details
        if (activePostId !== null) {
            renderPostDetail(activePostId);
        } else {
            renderFeed(posts);
        }
    });

    // Custom Feed Form logic
    $('#feed-name').on('input', function() {
        $('#feed-name-counter').text($(this).val().length + '/50');
    });
    $('#feed-desc').on('input', function() {
        $('#feed-desc-counter').text($(this).val().length + '/500');
    });
    $('#create-feed-form').submit(function(e) {
        e.preventDefault();
        
        // Get the feed name before resetting the form
        const feedName = $('#feed-name').val().trim();
        
        const modalEl = document.getElementById('createCustomFeedModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
        $(this)[0].reset();
        $('#feed-name-counter').text('0/50');
        $('#feed-desc-counter').text('0/500');
        
        // Close modal manually if needed due to backdrop issue
        $('.modal-backdrop').remove();
        $('body').removeClass('modal-open').css('padding-right', '');
        
        // Add the new feed to the left sidebar's custom feeds section
        if (feedName) {
            $('#feedsCollapse').append(`
                <a href="#" class="nav-item-link">
                    <i class="fa-solid fa-cube text-primary"></i> ${feedName}
                </a>
            `);
        }
        
        alert(`Custom feed "${feedName}" created and added to your sidebar!`);
    });
}
