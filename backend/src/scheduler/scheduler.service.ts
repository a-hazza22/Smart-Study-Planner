import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import { Express } from 'express';

@Injectable()
export class SchedulerService {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({
      
      apiKey: process.env.GROQ_API_KEY, //  API anahtarınızı buraya ekleyin
    });
  }

  // 
  // 
  async analyzeScheduleImage(file: Express.Multer.File) {
    try {
      console.log('  Groq ile analiz ediliyor (Llama 4 Scout)...');
      const base64Image = file.buffer.toString('base64');
      
      const response = await this.groq.chat.completions.create({
        model: "meta-llama/llama-4-scout-17b-16e-instruct", 
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Extract course names and difficulty (Zor/Orta/Kolay). Return ONLY raw JSON array. Example: [{\"name\": \"Math\", \"difficulty\": \"Zor\"}]" },
              { type: "image_url", image_url: { url: `data:${file.mimetype};base64,${base64Image}` } }
            ]
          }
        ],
        temperature: 0.1, 
      });

      console.log(' Analiz tamamlandı (Groq)');
      const content = response.choices[0]?.message?.content || "";
      
      console.log('fotograf response', content.substring(0, 100) + '...');

      return { success: true, courses: this.extractJSON(content) };

    } catch (e) {
      console.error('groq hata verildi', e.message);
      return this.getFallbackData();
    }
  }

  // 2. إنشاء الجدول (هنا التعديل فقط: أضفنا json_object)
  
 // =========================================================
  // 2. إنشاء الجدول (نظام 50+10 + ملء وقت الفراغ بالكامل)
  // =========================================================
 // =========================================================
  // 2. إنشاء الجدول (أجبرناه بالمثال على 7 أيام)
  // =========================================================
  async generateStudyPlan(data: any) {
    try {
      console.log(` 7 gün planı oluşturuluyor + ${data.freeTime} saat)...`);
      
      const completion = await this.groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { 
            role: "system", 
            content: `You are a strict university scheduler. 
            RULES:
            1. FILL THE ENTIRE FREE TIME: If user has ${data.freeTime} hours, fill exactly that time daily.
            2. TIMING:
               - Weekdays (Pazartesi-Cuma): Start 18:00.
               - Weekends (Cumartesi-Pazar): Start 10:00.
            3. DURATION: Study = 50 mins, Break = 10 mins.
            4. OUTPUT: Generate a full week plan (7 days) in JSON.` 
          },
          { 
            role: "user", 
            content: `Courses: ${JSON.stringify(data.courses)}. 
            Total Free Time: ${data.freeTime} Hours. 
            
            STRICTLY FOLLOW THIS JSON STRUCTURE FOR ALL 7 DAYS: 
            { 
              "week_plan": [
                { 
                  "day": "Pazartesi", 
                  "sessions": [
                    {"task": "Course A", "time": "18:00-18:50", "type": "study"},
                    {"task": "Mola", "time": "18:50-19:00", "type": "break"},
                    {"task": "Course B", "time": "19:00-19:50", "type": "study"}
                  ] 
                },
                { 
                  "day": "Salı", 
                  "sessions": [
                    {"task": "Course C", "time": "18:00-18:50", "type": "study"},
                    {"task": "Mola", "time": "18:50-19:00", "type": "break"}
                  ] 
                },
                { 
                  "day": "Çarşamba", 
                  "sessions": [
                    {"task": "Course D", "time": "18:00-18:50", "type": "study"}
                  ] 
                },
                { 
                  "day": "Perşembe", 
                  "sessions": [
                     {"task": "Course E", "time": "18:00-18:50", "type": "study"}
                  ] 
                },
                { 
                  "day": "Cuma", 
                  "sessions": [
                     {"task": "Course F", "time": "18:00-18:50", "type": "study"}
                  ] 
                },
                { 
                  "day": "Cumartesi", 
                  "sessions": [
                     {"task": "Course G", "time": "10:00-10:50", "type": "study"}
                  ] 
                },
                { 
                  "day": "Pazar", 
                  "sessions": [
                     {"task": "Course H", "time": "10:00-10:50", "type": "study"}
                  ] 
                }
              ] 
            }` 
          }
        ],
        response_format: { type: "json_object" }, 
        temperature: 0.1,
        max_tokens: 8000, // 👈 مهم جداً عشان ما يقطع النص
      });

      console.log('✅ Plan oluşturuldu (Groq)');
      const content = completion.choices[0]?.message?.content || "{}";
      
      console.log('🔍 Plan verisi:', content.substring(0, 100) + '...');

      return JSON.parse(content);

    } catch (e) {
      console.error('❌ Plan oluşturma hatasıِ:', e.message);
      return this.getFallbackSchedule();
    }
  }
  // --- دوال التنظيف والطوارئ (كما هي) ---

  private extractJSON(text: string) {
    try {
      if (!text) return [];
      let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const jsonMatch = cleanText.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
      if (jsonMatch) cleanText = jsonMatch[0];
      return JSON.parse(cleanText);
    } catch (e) { return []; }
  }

  private getFallbackData() {
    return { success: true, courses: [{ name: "Biçimsel Diller", difficulty: "Zor" }, { name: "Devre Teorisi", difficulty: "Zor" }] };
  }

  private getFallbackSchedule() {
     return { "week_plan": [ { "day": "Pazartesi", "sessions": [{ "task": "Yedek Plan: Devre Teorisi", "time": "18:00-19:00", "type": "study" }] } ] };
  }
}
