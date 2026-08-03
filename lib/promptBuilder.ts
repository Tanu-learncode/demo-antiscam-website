import type { InputType } from './detectType';

export interface AnalysisSchema {
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  summary: string;
  recommendation: string;
  indicators: string[];
  detectedType: InputType;
}

export function buildPrompt(content: string, detectedType: InputType) {
  const typeInstruction = {
    URL: 'Đầu vào là một URL. Tập trung vào các domain đáng ngờ, dấu hiệu lừa đảo (phishing), chuyển hướng, và các yếu tố thúc giục.',
    EMAIL: 'Đầu vào là một Email. Tập trung vào giả mạo email, sự thúc giục, yêu cầu tài chính, và mạo danh.',
    PHONE: 'Đầu vào là số điện thoại hoặc tin nhắn. Tập trung vào các mẫu tin nhắn lừa đảo, tấn công phi kỹ thuật, và áp lực chuyển khoản.',
    TEXT: 'Đầu vào là văn bản tự do. Tập trung vào sự thúc giục, thao túng tâm lý, mạo danh, và yêu cầu thanh toán.',
  }[detectedType];

  return `Bạn là một chuyên gia phân tích lừa đảo trực tuyến cho người dùng Việt Nam. Hãy phân tích nội dung sau và CHỈ trả về một JSON hợp lệ theo đúng schema này:
{
  "riskLevel": "low|medium|high",
  "confidence": 0-100,
  "summary": "Tóm tắt ngắn gọn",
  "recommendation": "Khuyến nghị hành động",
  "indicators": ["dấu hiệu 1", "dấu hiệu 2"],
  "detectedType": "URL|EMAIL|PHONE|TEXT"
}

Quy tắc bắt buộc:
- Luôn trả lời bằng tiếng Việt (Vietnamese).
- Tuyệt đối CHỈ trả về dữ liệu JSON dạng thô, KHÔNG sử dụng Markdown (không dùng \`\`\`json), KHÔNG có bất kỳ văn bản nào nằm ngoài JSON.
- Không dùng tiếng Anh (ngoại trừ các giá trị bắt buộc của schema là: low, medium, high, URL, EMAIL, PHONE, TEXT).
- 'summary', 'recommendation', 'indicators' phải được viết bằng tiếng Việt.
- Giữ summary ngắn gọn và thiết thực.
- confidence là một số nguyên từ 0 đến 100.
- ${typeInstruction}

Nội dung cần phân tích:
${content}`;
}
