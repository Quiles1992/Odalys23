// ============================================
// INTRO SCREEN - Gift Box Interaction
// ============================================
const introScreen = document.getElementById('intro-screen');
const giftBox = document.getElementById('giftBox');
const mainContent = document.getElementById('main-content');

giftBox.addEventListener('click', (e) => {
    e.stopPropagation();
    openGift();
});

introScreen.addEventListener('click', () => {
    openGift();
});

function openGift() {
    if (giftBox.classList.contains('opened')) return;
    giftBox.classList.add('opened');
    
    setTimeout(() => {
        introScreen.classList.add('fade-out');
        mainContent.classList.remove('hidden');
        
        // Start confetti burst
        launchConfetti();
        
        // Start background music
        startMusic();
        
        // Create background particles
        createParticles();
        
        // Initialize scroll animations
        initScrollAnimations();
        
        setTimeout(() => {
            introScreen.style.display = 'none';
        }, 800);
    }, 600);
}

// ============================================
// CONFETTI SYSTEM
// ============================================
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let confettiPieces = [];
let confettiAnimationId = null;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class ConfettiPiece {
    constructor(x, y, burst = false) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || -20;
        this.size = Math.random() * 8 + 4;
        this.speedX = (Math.random() - 0.5) * (burst ? 15 : 4);
        this.speedY = burst ? (Math.random() * -15 - 5) : (Math.random() * 3 + 2);
        this.gravity = 0.15;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
        this.opacity = 1;
        this.fadeSpeed = 0.003 + Math.random() * 0.005;
        this.shape = Math.floor(Math.random() * 3); // 0: rect, 1: circle, 2: heart
        
        const colors = [
            '#e91e8c', '#8b5cf6', '#06b6d4', '#f59e0b', 
            '#ec4899', '#d946ef', '#f43f5e', '#fbbf24',
            '#a78bfa', '#34d399', '#fb7185', '#818cf8'
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        this.speedY += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.opacity -= this.fadeSpeed;
        this.speedX *= 0.99;
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.fillStyle = this.color;
        
        if (this.shape === 0) {
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
        } else if (this.shape === 1) {
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Star shape
            const spikes = 5;
            const outerRadius = this.size / 2;
            const innerRadius = this.size / 4;
            ctx.beginPath();
            for (let i = 0; i < spikes * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = (i * Math.PI) / spikes - Math.PI / 2;
                ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
            }
            ctx.closePath();
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    isDead() {
        return this.opacity <= 0 || this.y > canvas.height + 50;
    }
}

function launchConfetti() {
    // Burst from center
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    for (let i = 0; i < 150; i++) {
        setTimeout(() => {
            confettiPieces.push(new ConfettiPiece(centerX, centerY, true));
        }, Math.random() * 400);
    }
    
    // Continuous rain from top
    let rainCount = 0;
    const rainInterval = setInterval(() => {
        for (let i = 0; i < 3; i++) {
            confettiPieces.push(new ConfettiPiece());
        }
        rainCount++;
        if (rainCount > 60) clearInterval(rainInterval);
    }, 100);
    
    if (!confettiAnimationId) {
        animateConfetti();
    }
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    confettiPieces = confettiPieces.filter(piece => !piece.isDead());
    
    confettiPieces.forEach(piece => {
        piece.update();
        piece.draw();
    });
    
    if (confettiPieces.length > 0) {
        confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
        confettiAnimationId = null;
    }
}

// ============================================
// BACKGROUND PARTICLES
// ============================================
function createParticles() {
    const container = document.getElementById('particles');
    const colors = ['#e91e8c', '#8b5cf6', '#06b6d4', '#d946ef', '#f59e0b'];
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 6 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 15 + 8) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        particle.style.boxShadow = `0 0 ${size * 2}px ${particle.style.backgroundColor}`;
        
        container.appendChild(particle);
    }
}

// ============================================
// SCROLL ANIMATIONS (Intersection Observer)
// ============================================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// SURPRISE BUTTON - Mega Confetti Finale
// ============================================
const surpriseBtn = document.getElementById('surpriseBtn');
let surpriseUsed = false;

surpriseBtn.addEventListener('click', () => {
    if (surpriseUsed) return;
    surpriseUsed = true;
    
    surpriseBtn.innerHTML = '<span>🥳 ¡Te amo mucho! 🥳</span>';
    surpriseBtn.style.background = '#8b5cf6';
    
    // Mega confetti burst from multiple points
    const points = [
        { x: canvas.width * 0.2, y: canvas.height },
        { x: canvas.width * 0.5, y: canvas.height },
        { x: canvas.width * 0.8, y: canvas.height },
        { x: 0, y: canvas.height * 0.5 },
        { x: canvas.width, y: canvas.height * 0.5 },
    ];
    
    points.forEach((point, idx) => {
        setTimeout(() => {
            for (let i = 0; i < 80; i++) {
                const piece = new ConfettiPiece(point.x, point.y, true);
                piece.speedY = Math.random() * -20 - 5;
                piece.speedX = (Math.random() - 0.5) * 20;
                confettiPieces.push(piece);
            }
        }, idx * 200);
    });
    
    if (!confettiAnimationId) {
        animateConfetti();
    }
    
    // Create floating emoji explosion
    createEmojiExplosion();
    
    // Show big floating message
    showFloatingMessage();
});

function createEmojiExplosion() {
    const emojis = ['🎂', '🎉', '🎊', '🥳', '💖', '🌟', '✨', '🎁', '🎈', '🦋', '🌸', '💕', '🩷', '💗', '🎆', '🎇'];
    
    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            const emoji = document.createElement('div');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.cssText = `
                position: fixed;
                font-size: ${Math.random() * 30 + 20}px;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                z-index: 10000;
                pointer-events: none;
                animation: mega-confetti-burst ${Math.random() * 2 + 1}s forwards;
                opacity: 0;
            `;
            
            // Custom animation for each emoji
            emoji.animate([
                { transform: 'scale(0) rotate(0deg)', opacity: 1 },
                { transform: `scale(${Math.random() * 1.5 + 0.5}) rotate(${Math.random() * 360}deg)`, opacity: 1, offset: 0.5 },
                { transform: `scale(0) rotate(${Math.random() * 720}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 2000 + 1000,
                easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                fill: 'forwards'
            });
            
            document.body.appendChild(emoji);
            setTimeout(() => emoji.remove(), 3000);
        }, Math.random() * 1500);
    }
}

function showFloatingMessage() {
    const msg = document.createElement('div');
    msg.innerHTML = '💝 ¡Felices 23 años, Odalys! 💝';
    msg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        font-family: 'Dancing Script', cursive;
        font-size: 2.5rem;
        color: white;
        text-shadow: 0 0 30px rgba(233, 30, 140, 0.8), 0 0 60px rgba(233, 30, 140, 0.4);
        z-index: 10001;
        pointer-events: none;
        white-space: nowrap;
        text-align: center;
    `;
    
    document.body.appendChild(msg);
    
    msg.animate([
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
        { transform: 'translate(-50%, -50%) scale(1.2)', opacity: 1, offset: 0.3 },
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1, offset: 0.5 },
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1, offset: 0.8 },
        { transform: 'translate(-50%, -50%) scale(1.5)', opacity: 0 }
    ], {
        duration: 4000,
        easing: 'ease-in-out',
        fill: 'forwards'
    });
    
    setTimeout(() => msg.remove(), 4500);
}

// ============================================
// MUSIC - YouTube IFrame API
// ============================================
let ytPlayer = null;
let ytReady = false;
let ytApiLoaded = false;
let musicStarted = false;
let isPlaying = false;
const musicToggle = document.getElementById('musicToggle');

// Load YouTube IFrame API dynamically
(function loadYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
})();

// YouTube API calls this globally when ready
window.onYouTubeIframeAPIReady = function() {
    ytPlayer = new YT.Player('yt-player', {
        height: '1',
        width: '1',
        videoId: 'G0R2lO6_P5Q',
        playerVars: {
            autoplay: 0,
            loop: 1,
            playlist: 'G0R2lO6_P5Q',
            controls: 0,
            showinfo: 0,
            modestbranding: 1,
            rel: 0,
            origin: window.location.origin
        },
        events: {
            onReady: function() {
                ytReady = true;
                ytPlayer.setVolume(80);
                // If gift was already opened before API loaded, play now
                if (musicStarted && !isPlaying) {
                    ytPlayer.playVideo();
                    isPlaying = true;
                    musicToggle.classList.add('playing');
                    musicToggle.textContent = '🎶';
                }
            },
            onError: function(e) {
                console.log('YT error:', e.data);
            }
        }
    });
};

function startMusic() {
    if (musicStarted) return;
    musicStarted = true;

    if (ytReady && ytPlayer) {
        ytPlayer.playVideo();
        isPlaying = true;
        musicToggle.classList.add('playing');
        musicToggle.textContent = '🎶';
    }
    // If not ready yet, the onReady callback above will start playback
}

musicToggle.addEventListener('click', () => {
    if (!ytReady || !ytPlayer) return;

    if (isPlaying) {
        ytPlayer.pauseVideo();
        isPlaying = false;
        musicToggle.classList.remove('playing');
        musicToggle.textContent = '🎵';
    } else {
        ytPlayer.playVideo();
        isPlaying = true;
        musicToggle.classList.add('playing');
        musicToggle.textContent = '🎶';
    }
});

// ============================================
// Smooth Parallax on Scroll
// ============================================
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroGlow = document.querySelector('.hero-glow');
    
    if (heroGlow) {
        heroGlow.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.3}px))`;
        heroGlow.style.opacity = Math.max(0, 1 - scrolled / 600);
    }
});

// ============================================
// Touch-friendly: Add active states
// ============================================
document.querySelectorAll('.reason-card, .wish-item, .surprise-btn').forEach(el => {
    el.addEventListener('touchstart', () => {
        el.style.transform = 'scale(0.97)';
    }, { passive: true });
    
    el.addEventListener('touchend', () => {
        el.style.transform = '';
    }, { passive: true });
});
